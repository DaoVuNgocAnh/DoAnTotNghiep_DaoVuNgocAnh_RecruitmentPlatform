import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/database/prisma.service';
import {
  CreateFeedbackDto,
  FeedbackQueryDto,
  UpdateFeedbackStatusDto,
} from './dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  create(userId: string | undefined, dto: CreateFeedbackDto) {
    return this.prisma.feedback.create({
      data: {
        userId,
        type: dto.type,
        title: dto.title,
        content: dto.content,
        pageUrl: dto.pageUrl,
      },
    });
  }

  async findAll(query: FeedbackQueryDto) {
    const where: Prisma.FeedbackWhereInput = {
      status: query.status || undefined,
      type: query.type || undefined,
    };

    return this.prisma.feedback.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateFeedbackStatusDto) {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new NotFoundException('Khong tim thay gop y');

    return this.prisma.feedback.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
