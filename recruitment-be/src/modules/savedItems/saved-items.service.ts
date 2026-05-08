import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SavedItemScope, TargetType } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { ToggleSavedItemDto } from './dto/toggle-saved-item.dto';

@Injectable()
export class SavedItemsService {
  constructor(private prisma: PrismaService) {}

  async updateNote(userId: string, itemId: string, note: string) {
    const item = await this.prisma.savedItem.findFirst({
      where: {
        id: itemId,
        userId,
        scope: SavedItemScope.PERSONAL,
        isDeleted: false,
      },
    });

    if (!item) throw new NotFoundException('Khong tim thay muc da luu');

    return this.prisma.savedItem.update({
      where: { id: itemId },
      data: { note },
    });
  }

  async updateCompanyNote(
    userId: string,
    companyId: string,
    itemId: string,
    note: string,
  ) {
    await this.ensureEmployerInCompany(userId, companyId);

    const item = await this.prisma.savedItem.findFirst({
      where: {
        id: itemId,
        companyId,
        scope: SavedItemScope.COMPANY,
        targetType: TargetType.CANDIDATE,
        isDeleted: false,
      },
    });

    if (!item)
      throw new NotFoundException('Khong tim thay ung vien trong kho cong ty');

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
        scope: SavedItemScope.PERSONAL,
        isDeleted: false,
      },
    });

    if (existing) {
      await this.prisma.savedItem.update({
        where: { id: existing.id },
        data: { isDeleted: true },
      });
      return { saved: false, message: 'Da bo luu' };
    }

    await this.ensureTargetExists(dto.targetId, dto.targetType);

    await this.prisma.savedItem.create({
      data: {
        userId,
        targetId: dto.targetId,
        targetType: dto.targetType,
        scope: SavedItemScope.PERSONAL,
      },
    });

    return { saved: true, message: 'Da luu thanh cong' };
  }

  async toggleCompanyCandidate(
    userId: string,
    companyId: string,
    candidateId: string,
  ) {
    await this.ensureEmployerInCompany(userId, companyId);
    await this.ensureTargetExists(candidateId, TargetType.CANDIDATE);

    const existing = await this.prisma.savedItem.findFirst({
      where: {
        companyId,
        targetId: candidateId,
        targetType: TargetType.CANDIDATE,
        scope: SavedItemScope.COMPANY,
        isDeleted: false,
      },
    });

    if (existing) {
      await this.prisma.savedItem.update({
        where: { id: existing.id },
        data: { isDeleted: true },
      });
      return { saved: false, message: 'Da go khoi kho ung vien cong ty' };
    }

    await this.prisma.savedItem.create({
      data: {
        userId,
        companyId,
        targetId: candidateId,
        targetType: TargetType.CANDIDATE,
        scope: SavedItemScope.COMPANY,
      },
    });

    return { saved: true, message: 'Da dua vao kho ung vien cong ty' };
  }

  async findAll(userId: string, targetType?: TargetType) {
    const items = await this.prisma.savedItem.findMany({
      where: {
        userId,
        targetType: targetType || undefined,
        scope: SavedItemScope.PERSONAL,
        isDeleted: false,
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return this.populateDetails(items);
  }

  async findCompanyCandidates(userId: string, companyId: string) {
    await this.ensureEmployerInCompany(userId, companyId);

    const items = await this.prisma.savedItem.findMany({
      where: {
        companyId,
        targetType: TargetType.CANDIDATE,
        scope: SavedItemScope.COMPANY,
        isDeleted: false,
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return this.populateDetails(items);
  }

  async checkStatus(userId: string, targetId: string) {
    const existing = await this.prisma.savedItem.findFirst({
      where: {
        userId,
        targetId,
        scope: SavedItemScope.PERSONAL,
        isDeleted: false,
      },
    });
    return { isSaved: !!existing };
  }

  async checkCompanyCandidate(companyId: string, targetId: string) {
    const existing = await this.prisma.savedItem.findFirst({
      where: {
        companyId,
        targetId,
        targetType: TargetType.CANDIDATE,
        scope: SavedItemScope.COMPANY,
        isDeleted: false,
      },
    });
    return { isSaved: !!existing };
  }

  private async populateDetails(items: any[]) {
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
        }

        const details = await this.prisma.user.findUnique({
          where: { id: item.targetId },
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            email: true,
            phone: true,
            skills: true,
          },
        });

        return { ...item, details };
      }),
    );
  }

  private async ensureTargetExists(targetId: string, targetType: TargetType) {
    if (targetType === TargetType.JOB) {
      const job = await this.prisma.job.findUnique({ where: { id: targetId } });
      if (!job) throw new NotFoundException('Khong tim thay viec lam');
      return;
    }

    const candidate = await this.prisma.user.findUnique({
      where: { id: targetId },
    });
    if (!candidate) throw new NotFoundException('Khong tim thay ung vien');
  }

  private async ensureEmployerInCompany(userId: string, companyId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, companyId, isDeleted: false },
      select: { id: true },
    });

    if (!user)
      throw new ForbiddenException(
        'Ban khong co quyen truy cap kho ung vien cong ty',
      );
  }
}
