import { 
  Controller, Post, Get, Patch, Delete, Body, 
  Param, UseGuards, Request, UploadedFile, UseInterceptors,
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/resume.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('resumes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

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
    ) file: Express.Multer.File,
    @Body() dto: CreateResumeDto
  ) {
    return this.resumeService.create(req.user.userId, file, dto);
  }

  @Get('my')
  @Roles(Role.CANDIDATE, Role.EMPLOYER) // Employer cũng có thể quản lý CV nếu muốn apply chéo
  getMyResumes(@Request() req) {
    return this.resumeService.findMyResumes(req.user.userId);
  }

  @Patch(':id/default')
  @Roles(Role.CANDIDATE)
  setDefault(@Request() req, @Param('id') id: string) {
    return this.resumeService.setDefault(req.user.userId, id);
  }

  @Delete(':id')
  @Roles(Role.CANDIDATE)
  delete(@Request() req, @Param('id') id: string) {
    return this.resumeService.delete(req.user.userId, id);
  }
}