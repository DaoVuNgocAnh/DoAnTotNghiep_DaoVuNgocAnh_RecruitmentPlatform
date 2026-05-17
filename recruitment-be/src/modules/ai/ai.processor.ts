import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AiService } from './ai.service';
import { PrismaService } from 'src/core/database/prisma.service';
import * as path from 'path';

@Processor('AI_QUEUE')
export class AiProcessor extends WorkerHost {
  private readonly logger = new Logger(AiProcessor.name);

  constructor(
    private aiService: AiService,
    private prisma: PrismaService,
  ) {
    super();
    this.logger.log('--- AiProcessor WORKER STARTING ---');
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id}...`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { type = 'resume' } = job.data; // Mặc định là resume nếu không truyền type

    if (type === 'resume') {
      return this.handleResumeAnalysis(job);
    } else if (type === 'job') {
      return this.handleJobAnalysis(job);
    }
  }

  private async handleResumeAnalysis(job: Job<any>) {
    const { resumeId, fileUrl } = job.data;
    this.logger.log(`Processing AI analysis for Resume ID: ${resumeId}`);

    try {
      // 1. Trích xuất text (Hỗ trợ cả PDF và DOCX)
      const ext = path.extname(fileUrl).toLowerCase();
      let text = '';

      if (ext === '.pdf') {
        text = await this.aiService.extractTextFromPdf(fileUrl);
      } else if (ext === '.docx' || ext === '.doc') {
        text = await this.aiService.extractTextFromDocx(fileUrl);
      }

      if (!text || text.trim().length === 0) {
        this.logger.warn(`No text extracted from Resume ${resumeId}`);
        return;
      }

      // 2. Phân tích bằng Gemini
      const analysis = await this.aiService.analyzeResumeWithGemini(text);

      // 3. Cập nhật vào Database Resume
      // CHỈ lưu vào bảng Resume, KHÔNG tự động ghi đè vào Profile User để đảm bảo quyền kiểm soát dữ liệu của người dùng
      const resume = await this.prisma.resume.update({
        where: { id: resumeId },
        data: {
          parsedSkills: analysis.skills.join(', '),
          parsedJobTitle: analysis.jobTitle,
        },
      });

      this.logger.log(`AI Analysis completed for Resume ${resumeId}`);
      return analysis;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error in AiProcessor for Resume ${resumeId}: ${errorMessage}`,
      );
      throw error;
    }
  }

  private async handleJobAnalysis(job: Job<any>) {
    const { jobId } = job.data;
    this.logger.log(`Processing AI analysis for Job ID: ${jobId}`);

    try {
      const jobData = await this.prisma.job.findUnique({
        where: { id: jobId },
      });

      if (!jobData) {
        this.logger.error(`Job with ID ${jobId} not found in database`);
        return;
      }

      this.logger.log(`Analyzing Job: ${jobData.title}`);
      const analysis = await this.aiService.analyzeJobWithGemini(
        jobData.title,
        jobData.description,
        jobData.requirement,
      );

      this.logger.log(
        `AI extracted skills for Job ${jobId}: ${analysis.skills.join(', ')}`,
      );

      await this.prisma.job.update({
        where: { id: jobId },
        data: {
          parsedSkills: analysis.skills.join(', '),
        },
      });

      this.logger.log(`AI Analysis completed and saved for Job ${jobId}`);
      return analysis;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error in AiProcessor for Job ${jobId}: ${errorMessage}`,
      );
      throw error;
    }
  }
}
