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
        analysis,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async create(
    userId: string,
    file: Express.Multer.File,
    dto: CreateResumeDto,
  ) {
    const isDraft = dto.isDraft === true;

    // A. HỖ TRỢ CẬP NHẬT CV (NẾU CÓ DTO.ID)
    if (dto.id) {
      const existing = await this.prisma.resume.findFirst({
        where: { id: dto.id, candidateId: userId, isDeleted: false },
      });
      if (!existing) {
        throw new BadRequestException('Không tìm thấy CV cần cập nhật');
      }

      let fileUrl = existing.fileUrl;
      let ext = '.pdf';
      if (file) {
        ext = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.pdf', '.doc', '.docx'];
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
        const uploadRes = await this.cloudinary.uploadFile(file);
        if (existing.fileUrl) {
          try {
            await this.cloudinary.deleteFile(existing.fileUrl);
          } catch (delError) {
            console.error('Lỗi khi xóa file cũ trên Cloudinary:', delError);
          }
        }
        fileUrl = uploadRes.secure_url;
      }

      // Nếu set làm mặc định (và không phải nháp)
      if (dto.isDefault && !isDraft) {
        await this.prisma.resume.updateMany({
          where: { candidateId: userId },
          data: { isDefault: false },
        });
      }

      const updatedResume = await this.prisma.resume.update({
        where: { id: dto.id },
        data: {
          resumeName: dto.resumeName,
          fileUrl,
          isDraft,
          draftData: dto.draftData || null,
          isDefault: isDraft ? false : (dto.isDefault ?? existing.isDefault),
          parsedJobTitle: dto.parsedJobTitle || existing.parsedJobTitle,
          parsedSkills: dto.parsedSkills || existing.parsedSkills,
        },
      });

      // Cập nhật kỹ năng ứng viên nếu không phải nháp
      if (dto.parsedSkills && !isDraft) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { skills: dto.parsedSkills },
        });
      }

      return updatedResume;
    }

    // B. TẠO MỚI CV (NẾU KHÔNG CÓ DTO.ID)
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
    if (dto.isDefault && !isDraft) {
      await this.prisma.resume.updateMany({
        where: { candidateId: userId },
        data: { isDefault: false },
      });
    }

    // 4. Nếu là CV đầu tiên, tự động set làm mặc định (chỉ khi không phải bản nháp)
    const count = await this.prisma.resume.count({
      where: { candidateId: userId, isDeleted: false, isDraft: false },
    });
    const shouldBeDefault = (!isDraft && count === 0) ? true : (isDraft ? false : dto.isDefault);

    // 5. Lưu vào Database
    const resume = await this.prisma.resume.create({
      data: {
        resumeName: dto.resumeName,
        fileUrl: uploadRes.secure_url,
        isDefault: !!shouldBeDefault,
        isDraft,
        draftData: dto.draftData || null,
        candidateId: userId,
        parsedJobTitle: dto.parsedJobTitle || null,
        parsedSkills: dto.parsedSkills || null,
      },
    });

    // 6. Đẩy vào hàng đợi AI xử lý (Chỉ chạy nếu không có sẵn thông tin kỹ năng/vị trí và không phải nháp)
    if (!isDraft && !dto.parsedJobTitle && !dto.parsedSkills) {
      if (ext === '.pdf' || ext === '.docx' || ext === '.doc') {
        await this.aiQueue.add('analyze-resume', {
          resumeId: resume.id,
          fileUrl: resume.fileUrl,
          type: 'resume',
        });
      }
    } else if (!isDraft) {
      // Nếu có sẵn parsedSkills, cập nhật luôn trường skills của User (để tiện khớp việc làm nhanh)
      if (dto.parsedSkills) {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            skills: dto.parsedSkills,
          },
        });
      }
    }

    return resume;
  }

  async findOne(userId: string, id: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, candidateId: userId, isDeleted: false },
    });
    if (!resume) {
      throw new NotFoundException('Không tìm thấy CV yêu cầu');
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

    if (resume.fileUrl) {
      try {
        await this.cloudinary.deleteFile(resume.fileUrl);
      } catch (delError) {
        console.error('Lỗi khi xóa file trên Cloudinary khi xóa CV:', delError);
      }
    }

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
