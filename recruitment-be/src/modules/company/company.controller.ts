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

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // ==========================================
  // ROUTE DÀNH CHO EMPLOYER & PUBLIC
  // ==========================================

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

  @Roles(Role.EMPLOYER)
  @Post('join/:companyId')
  sendJoin(@Request() req, @Param('companyId') companyId: string) {
    return this.companyService.sendJoinRequest(req.user.userId, companyId);
  }

  @Roles(Role.EMPLOYER)
  @Get('my-company/requests')
  getRequests(@Request() req) {
    return this.companyService.getMyCompanyRequests(req.user.userId);
  }

  @Roles(Role.EMPLOYER)
  @Patch('requests/:id/:status')
  handleRequest(
    @Request() req,
    @Param('id') id: string,
    @Param('status') status: RequestStatus,
  ) {
    return this.companyService.handleJoinRequest(req.user.userId, id, status);
  }

  @Delete('my-company')
  @Roles(Role.EMPLOYER)
  removeRejected(@Request() req) {
    return this.companyService.deleteRejectedCompany(req.user.userId);
  }

  // ==========================================
  // ROUTE DÀNH RIÊNG CHO ADMIN HỆ THỐNG
  // ==========================================

  // 1. Admin lấy toàn bộ danh sách công ty để phê duyệt
  @Get('admin/all')
  @Roles(Role.ADMIN)
  findAllForAdmin(
    @Query('status') status?: CompanyStatus,
    @Query('search') search?: string,
  ) {
    return this.companyService.findAllForAdmin({ status, search });
  }

  // 2. Admin cập nhật trạng thái (VERIFIED, REJECTED, BLACKLISH)
  @Patch(':id/status')
  @Roles(Role.ADMIN)
  updateStatus(@Param('id') id: string, @Body('status') status: CompanyStatus) {
    return this.companyService.updateStatusByAdmin(id, status);
  }

  @Delete('requests/:id/cancel')
  @Roles(Role.EMPLOYER)
  cancelRequest(@Request() req, @Param('id') id: string) {
    return this.companyService.cancelJoinRequest(req.user.userId, id);
  }
}
