import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/resume.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@ApiTags('Resumes')
@ApiBearerAuth()
@Controller('resumes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @ApiOperation({ summary: 'Upload CV (Dành cho Ứng viên - Tối đa 10MB PDF/DOCX)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: { type: 'string' }
      },
    },
  })
  @Post('upload')
  @Roles(Role.CANDIDATE)
  @UseInterceptors(FileInterceptor('file'))
  uploadResume(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: CreateResumeDto,
  ) {
    return this.resumeService.create(req.user.userId, file, dto);
  }

  @ApiOperation({ summary: 'Lấy danh sách CV cá nhân' })
  @Get('my')
  @Roles(Role.CANDIDATE, Role.EMPLOYER) // Employer cũng có thể quản lý CV nếu muốn apply chéo
  getMyResumes(@Request() req, @Query() pagination: PaginationQueryDto) {
    return this.resumeService.findMyResumes(req.user.userId, pagination);
  }

  @ApiOperation({ summary: 'Đặt CV làm mặc định' })
  @Patch(':id/default')
  @Roles(Role.CANDIDATE)
  setDefault(@Request() req, @Param('id') id: string) {
    return this.resumeService.setDefault(req.user.userId, id);
  }

  @ApiOperation({ summary: 'Xóa CV' })
  @Delete(':id')
  @Roles(Role.CANDIDATE)
  delete(@Request() req, @Param('id') id: string) {
    return this.resumeService.delete(req.user.userId, id);
  }

  @ApiOperation({ summary: 'Trigger AI Analysis (Debug)' })
  @Post(':id/analyze')
  @Roles(Role.CANDIDATE)
  triggerAi(@Request() req, @Param('id') id: string) {
    return this.resumeService.analyzeWithAi(req.user.userId, id);
  }
}
