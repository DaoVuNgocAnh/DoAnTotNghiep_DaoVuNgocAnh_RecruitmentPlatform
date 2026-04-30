import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto, UpdateInterviewStatusDto } from './dto/interview.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('interviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InterviewController {
  constructor(private readonly service: InterviewService) {}

  @Post()
  @Roles(Role.EMPLOYER)
  create(@Request() req, @Body() dto: CreateInterviewDto) {
    return this.service.create(req.user.userId, req.user.companyId, dto);
  }

  @Get('employer')
  @Roles(Role.EMPLOYER)
  getEmployerInterviews(@Request() req) {
    return this.service.findByEmployer(req.user.companyId);
  }

  @Get('my-interviews')
  @Roles(Role.CANDIDATE)
  getCandidateInterviews(@Request() req) {
    return this.service.findByCandidate(req.user.userId);
  }

  @Patch(':id/status')
  @Roles(Role.CANDIDATE)
  updateStatus(@Param('id') id: string, @Request() req, @Body() dto: UpdateInterviewStatusDto) {
    return this.service.updateStatus(req.user.userId, id, dto);
  }
}
