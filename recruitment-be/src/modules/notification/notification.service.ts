import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './notification.gateway';
import { Role } from '@prisma/client';
import {
  PaginatedResponse,
  PaginationQueryDto,
} from 'src/common/dto/pagination.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: createNotificationDto,
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Gửi thông báo real-time
    this.notificationGateway.sendNotificationToUser(
      createNotificationDto.receiverId,
      notification,
    );

    return notification;
  }

  async sendToAdmins(data: Omit<CreateNotificationDto, 'receiverId'>) {
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN, isDeleted: false },
      select: { id: true },
    });

    const notifications = await Promise.all(
      admins.map((admin) =>
        this.create({
          ...data,
          receiverId: admin.id,
        }),
      ),
    );

    return notifications;
  }

  async findAll(
    receiverId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = { receiverId };

    const [total, notifications] = await this.prisma.$transaction([
      this.prisma.notification.count({ where }),
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async countUnread(receiverId: string) {
    return this.prisma.notification.count({
      where: { receiverId, isRead: false },
    });
  }

  async markAsRead(receiverId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, receiverId },
    });

    if (!notification) throw new NotFoundException('Không tìm thấy thông báo');

    return this.prisma.notification.update({
      where: { id: notification.id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(receiverId: string) {
    return this.prisma.notification.updateMany({
      where: { receiverId, isRead: false },
      data: { isRead: true },
    });
  }

  async remove(receiverId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, receiverId },
    });

    if (!notification) throw new NotFoundException('Không tìm thấy thông báo');

    return this.prisma.notification.delete({
      where: { id: notification.id },
    });
  }
}
