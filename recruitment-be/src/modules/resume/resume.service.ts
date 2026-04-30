import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { CreateResumeDto } from './dto/resume.dto';
import * as path from 'path';

@Injectable()
export class ResumeService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(userId: string, file: Express.Multer.File, dto: CreateResumeDto) {
    if (!file) throw new BadRequestException('Vui lòng tải lên file CV (PDF/Docx)');

    // 1. Kiểm tra định dạng file thủ công
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Định dạng file không hợp lệ. Chỉ chấp nhận PDF, DOC, DOCX');
    }

    // 2. Upload lên Cloudinary
    const uploadRes = await this.cloudinary.uploadFile(file);

    // 3. Nếu chọn làm mặc định, bỏ mặc định của các CV cũ
    if (dto.isDefault) {
      await this.prisma.resume.updateMany({
        where: { candidateId: userId },
        data: { isDefault: false },
      });
    }

    // 4. Nếu là CV đầu tiên, tự động set làm mặc định
    const count = await this.prisma.resume.count({ where: { candidateId: userId, isDeleted: false } });
    const shouldBeDefault = count === 0 ? true : dto.isDefault;

    // 5. Lưu vào Database
    return this.prisma.resume.create({
      data: {
        resumeName: dto.resumeName,
        fileUrl: uploadRes.secure_url,
        isDefault: !!shouldBeDefault,
        candidateId: userId,
      },
    });
  }

  async findMyResumes(userId: string) {
    return this.prisma.resume.findMany({
      where: { candidateId: userId, isDeleted: false },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async setDefault(userId: string, resumeId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.resume.updateMany({
        where: { candidateId: userId },
        data: { isDefault: false },
      });

      return tx.resume.update({
        where: { id: resumeId, candidateId: userId },
        data: { isDefault: true },
      });
    });
  }

  async delete(userId: string, resumeId: string) {
    const resume = await this.prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume || resume.candidateId !== userId) throw new NotFoundException('Không tìm thấy CV');

    return this.prisma.$transaction(async (tx) => {
      // 1. Đánh dấu xóa
      const updatedResume = await tx.resume.update({
        where: { id: resumeId },
        data: { isDeleted: true, isDefault: false },
      });

      // 2. Nếu CV bị xóa đang là mặc định, tìm CV khác để thay thế
      if (resume.isDefault) {
        const nextResume = await tx.resume.findFirst({
          where: { candidateId: userId, isDeleted: false },
          orderBy: { uploadedAt: 'desc' },
        });

        if (nextResume) {
          await tx.resume.update({
            where: { id: nextResume.id },
            data: { isDefault: true },
          });
        }
      }

      return updatedResume;
    });
  }
}