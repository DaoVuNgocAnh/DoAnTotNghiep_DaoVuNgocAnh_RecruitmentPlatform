import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/application.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationController {
  constructor(private readonly service: ApplicationService) {}

  @Post()
  @Roles(Role.CANDIDATE)
  create(@Request() req, @Body() dto: CreateApplicationDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Get('my-applications')
  @Roles(Role.CANDIDATE)
  getMyApps(@Request() req) {
    return this.service.findByCandidate(req.user.userId);
  }

  @Get('employer')
  @Roles(Role.EMPLOYER)
  getEmployerApps(@Request() req) {
    return this.service.findByEmployer(req.user.companyId);
  }

  @Patch(':id/status')
  @Roles(Role.EMPLOYER)
  updateStatus(@Param('id') id: string, @Request() req, @Body() dto: UpdateApplicationStatusDto) {
    return this.service.updateStatus(id, req.user.companyId, dto);
  }
}