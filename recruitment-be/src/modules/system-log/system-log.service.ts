import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateSystemLogDto, SystemLogQueryDto } from './dto/system-log.dto';

@Injectable()
export class SystemLogService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: CreateSystemLogDto) {
    return this.prisma.systemLog.create({
      data,
    });
  }

  async findAll(query: SystemLogQueryDto) {
    const { page = 1, limit = 10, actionType, targetType, userEmail } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.SystemLogWhereInput = {};

    if (actionType) {
      where.actionType = { contains: actionType, mode: 'insensitive' };
    }
    if (targetType) where.targetType = targetType;
    if (userEmail) {
      where.user = { email: { contains: userEmail, mode: 'insensitive' } };
    }

    const [data, total] = await Promise.all([
      this.prisma.systemLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { actionDate: 'desc' },
        include: { user: { select: { email: true, fullName: true } } },
      }),
      this.prisma.systemLog.count({ where }),
    ]);
    return { data, total, page, limit };
  }
}
