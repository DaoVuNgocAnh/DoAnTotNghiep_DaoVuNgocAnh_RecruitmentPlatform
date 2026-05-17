import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from 'src/core/database/prisma.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { CreateResumeDto } from './dto/resume.dto';
import * as path from 'path';
import { AiService } from '../ai/ai.service';
import {
  PaginatedResponse,
  PaginationQueryDto,
} from 'src/common/dto/pagination.dto';

@Injectable()
export class ResumeService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private aiService: AiService,
    @InjectQueue('AI_QUEUE') private aiQueue: Queue,
  ) {}

  async analyzeWithAi(userId: string, resumeId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume || resume.candidateId !== userId) {
      throw new NotFoundException('Không tìm thấy CV');
    }

    try {
      // Gọi trực tiếp AiService để debug
      const text = await this.aiService.extractTextFromPdf(resume.fileUrl);
      const analysis = await this.aiService.analyzeResumeWithGemini(text);

      const updated = await this.prisma.resume.update({
        where: { id: resumeId },
        data: {
          parsedSkills: analysis.skills.join(', '),
          parsedJobTitle: analysis.jobTitle,
        },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          skills: analysis.skills.join(', '),
        },
      });

      return {
        success: true,
        data: updated,
        analysis
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async create(
    userId: string,
    file: Express.Multer.File,
    dto: CreateResumeDto,
  ) {
    if (!file)
      throw new BadRequestException('Vui lòng tải lên file CV (PDF/Docx)');

    // 1. Kiểm tra định dạng file thủ công
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (
      !allowedExtensions.includes(ext) ||
      !allowedMimeTypes.includes(file.mimetype)
    ) {
      throw new BadRequestException(
        'Định dạng file không hợp lệ. Chỉ chấp nhận PDF, DOC, DOCX',
      );
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
    const count = await this.prisma.resume.count({
      where: { candidateId: userId, isDeleted: false },
    });
    const shouldBeDefault = count === 0 ? true : dto.isDefault;

    // 5. Lưu vào Database
    const resume = await this.prisma.resume.create({
      data: {
        resumeName: dto.resumeName,
        fileUrl: uploadRes.secure_url,
        isDefault: !!shouldBeDefault,
        candidateId: userId,
      },
    });

    // 6. Đẩy vào hàng đợi AI xử lý (Hỗ trợ PDF và DOCX)
    if (ext === '.pdf' || ext === '.docx' || ext === '.doc') {
      await this.aiQueue.add('analyze-resume', {
        resumeId: resume.id,
        fileUrl: resume.fileUrl,
        type: 'resume',
      });
    }

    return resume;
  }

  async findMyResumes(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = { candidateId: userId, isDeleted: false };

    const [total, resumes] = await this.prisma.$transaction([
      this.prisma.resume.count({ where }),
      this.prisma.resume.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: resumes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
    });
    if (!resume || resume.candidateId !== userId)
      throw new NotFoundException('Không tìm thấy CV');

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
