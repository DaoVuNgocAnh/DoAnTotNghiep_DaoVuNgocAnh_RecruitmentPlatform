import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { ToggleSavedItemDto } from './dto/toggle-saved-item.dto';
import { TargetType } from '@prisma/client';

@Injectable()
export class SavedItemsService {
  constructor(private prisma: PrismaService) {}

  async updateNote(userId: string, itemId: string, note: string) {
    const item = await this.prisma.savedItem.findFirst({
      where: { id: itemId, userId, isDeleted: false },
    });

    if (!item) throw new NotFoundException('Không tìm thấy mục đã lưu');

    return this.prisma.savedItem.update({
      where: { id: itemId },
      data: { note },
    });
  }

  async toggle(userId: string, dto: ToggleSavedItemDto) {
    const existing = await this.prisma.savedItem.findFirst({
      where: {
        userId,
        targetId: dto.targetId,
        targetType: dto.targetType,
        isDeleted: false,
      },
    });

    if (existing) {
      await this.prisma.savedItem.update({
        where: { id: existing.id },
        data: { isDeleted: true },
      });
      return { saved: false, message: 'Đã bỏ lưu' };
    }

    // Kiểm tra xem đối tượng mục tiêu có tồn tại không
    if (dto.targetType === TargetType.JOB) {
      const job = await this.prisma.job.findUnique({ where: { id: dto.targetId } });
      if (!job) throw new NotFoundException('Không tìm thấy việc làm');
    } else {
      const candidate = await this.prisma.user.findUnique({ where: { id: dto.targetId } });
      if (!candidate) throw new NotFoundException('Không tìm thấy ứng viên');
    }

    await this.prisma.savedItem.create({
      data: {
        userId,
        targetId: dto.targetId,
        targetType: dto.targetType,
      },
    });

    return { saved: true, message: 'Đã lưu thành công' };
  }

  async findAll(userId: string, targetType?: TargetType) {
    const items = await this.prisma.savedItem.findMany({
      where: {
        userId,
        targetType: targetType || undefined,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Populate dữ liệu chi tiết
    return Promise.all(
      items.map(async (item) => {
        if (item.targetType === TargetType.JOB) {
          const details = await this.prisma.job.findUnique({
            where: { id: item.targetId },
            include: {
              company: { select: { name: true, logoUrl: true } },
              category: { select: { name: true } },
            },
          });

          return { ...item, details };
        } else {
          const details = await this.prisma.user.findUnique({
            where: { id: item.targetId },
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              email: true,
              phone: true,
            },
          });

          return { ...item, details };
        }
      }),
    );
  }

  async checkStatus(userId: string, targetId: string) {
    const existing = await this.prisma.savedItem.findFirst({
      where: {
        userId,
        targetId,
        isDeleted: false,
      },
    });
    return { isSaved: !!existing };
  }
}
