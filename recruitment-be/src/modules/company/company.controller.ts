import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  UseGuards,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role, RequestStatus, CompanyStatus } from '@prisma/client'; // Import thêm CompanyStatus
import { CompanyDto } from './dto/company.dto';
import { JobAssigneeDto } from './dto/job-assignee.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // ==========================================
  // ROUTE CÔNG KHAI (PUBLIC)
  // ==========================================

  @Get()
  findAllPublic(@Query('search') search?: string) {
    return this.companyService.findAllPublic({ search });
  }

  @Get(':id/public')
  findOnePublic(@Param('id') id: string) {
    return this.companyService.findOnePublic(id);
  }

  // ==========================================
  // ROUTE DÀNH CHO EMPLOYER & CÓ ĐĂNG NHẬP
  // ==========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Post()
  create(@Request() req, @Body() dto: CompanyDto) {
    return this.companyService.create(req.user.userId, dto);
  }

  // Public: Tìm kiếm công ty theo MST (Dùng cho HR xin gia nhập)
  @Get('search')
  search(@Query('taxCode') taxCode: string) {
    return this.companyService.findByTaxCode(taxCode);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Post('join/:companyId')
  sendJoin(@Request() req, @Param('companyId') companyId: string) {
    return this.companyService.sendJoinRequest(req.user.userId, companyId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Get('my-company/requests')
  getRequests(@Request() req) {
    return this.companyService.getMyCompanyRequests(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Get('my-company/members')
  getMembers(@Request() req) {
    return this.companyService.getMembers(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Post('jobs/:jobId/assignees')
  assignMemberToJob(
    @Request() req,
    @Param('jobId') jobId: string,
    @Body() dto: JobAssigneeDto,
  ) {
    return this.companyService.assignMemberToJob(req.user.userId, jobId, dto.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Delete('jobs/:jobId/assignees/:userId')
  unassignMemberFromJob(
    @Request() req,
    @Param('jobId') jobId: string,
    @Param('userId') userId: string,
  ) {
    return this.companyService.unassignMemberFromJob(req.user.userId, jobId, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Patch('requests/:id/:status')
  handleRequest(
    @Request() req,
    @Param('id') id: string,
    @Param('status') status: RequestStatus,
  ) {
    return this.companyService.handleJoinRequest(req.user.userId, id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('my-company')
  @Roles(Role.EMPLOYER)
  removeRejected(@Request() req) {
    return this.companyService.deleteRejectedCompany(req.user.userId);
  }

  // ==========================================
  // ROUTE DÀNH RIÊNG CHO ADMIN HỆ THỐNG
  // ==========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/all')
  @Roles(Role.ADMIN)
  findAllForAdmin(
    @Query('status') status?: CompanyStatus,
    @Query('search') search?: string,
  ) {
    return this.companyService.findAllForAdmin({ status, search });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/status')
  @Roles(Role.ADMIN)
  updateStatus(@Param('id') id: string, @Body('status') status: CompanyStatus) {
    return this.companyService.updateStatusByAdmin(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('requests/:id/cancel')
  @Roles(Role.EMPLOYER)
  cancelRequest(@Request() req, @Param('id') id: string) {
    return this.companyService.cancelJoinRequest(req.user.userId, id);
  }
}
