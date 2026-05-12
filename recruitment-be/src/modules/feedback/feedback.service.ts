import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/database/prisma.service';
import {
  CreateFeedbackDto,
  FeedbackQueryDto,
  UpdateFeedbackStatusDto,
} from './dto/feedback.dto';
import { PaginatedResponse } from 'src/common/dto/pagination.dto';

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

  async findAll(query: FeedbackQueryDto): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, status, type } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.FeedbackWhereInput = {
      status: status || undefined,
      type: type || undefined,
    };

    const [total, feedback] = await this.prisma.$transaction([
      this.prisma.feedback.count({ where }),
      this.prisma.feedback.findMany({
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
        skip,
        take: limit,
      }),
    ]);

    return {
      data: feedback,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
