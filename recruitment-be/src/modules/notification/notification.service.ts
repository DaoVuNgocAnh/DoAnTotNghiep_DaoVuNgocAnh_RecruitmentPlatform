import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './notification.gateway';
import { Role } from '@prisma/client';

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

  async findAll(receiverId: string) {
    return this.prisma.notification.findMany({
      where: { receiverId },
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
    });
  }

  async countUnread(receiverId: string) {
    return this.prisma.notification.count({
      where: { receiverId, isRead: false },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(receiverId: string) {
    return this.prisma.notification.updateMany({
      where: { receiverId, isRead: false },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
