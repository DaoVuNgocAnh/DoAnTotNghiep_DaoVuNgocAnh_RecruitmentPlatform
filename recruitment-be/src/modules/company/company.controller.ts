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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  Role,
  RequestStatus,
  CompanyStatus,
  PremiumRequestStatus,
} from '@prisma/client';
import { CompanyDto } from './dto/company.dto';
import { JobAssigneeDto } from './dto/job-assignee.dto';
import { CreatePremiumRequestDto } from './dto/premium-request.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import {
  AdminCompanyQueryDto,
  GetCompaniesQueryDto,
} from './dto/company-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // ==========================================
  // ROUTE CÔNG KHAI (PUBLIC)
  // ==========================================

  @ApiOperation({ summary: 'Tìm kiếm công ty (Public)' })
  @Get()
  findAllPublic(@Query() query: GetCompaniesQueryDto) {
    return this.companyService.findAllPublic(query);
  }

  @ApiOperation({ summary: 'Xem chi tiết công ty (Public)' })
  @Get(':id/public')
  findOnePublic(@Param('id') id: string) {
    return this.companyService.findOnePublic(id);
  }

  // ==========================================
  // ROUTE DÀNH CHO EMPLOYER & CÓ ĐĂNG NHẬP
  // ==========================================

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng ký công ty mới (Chủ sở hữu)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Post()
  create(@Request() req, @Body() dto: CompanyDto) {
    return this.companyService.create(req.user.userId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin công ty (Chủ sở hữu)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Patch('my-company')
  update(@Request() req, @Body() dto: Partial<CompanyDto>) {
    return this.companyService.update(req.user.userId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật Logo công ty (Chủ sở hữu)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Patch('my-company/logo')
  @UseInterceptors(FileInterceptor('logo'))
  updateLogo(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.companyService.updateLogo(req.user.userId, file);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật Ảnh bìa công ty (Chủ sở hữu)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cover: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Patch('my-company/cover')
  @UseInterceptors(FileInterceptor('cover'))
  updateCover(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3 * 1024 * 1024 }), // 3MB for cover
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.companyService.updateCover(req.user.userId, file);
  }

  @ApiOperation({ summary: 'Tìm kiếm công ty theo mã số thuế' })
  // Public: Tìm kiếm công ty theo MST (Dùng cho HR xin gia nhập)
  @Get('search')
  search(@Query('taxCode') taxCode: string) {
    return this.companyService.findByTaxCode(taxCode);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gửi yêu cầu tham gia công ty (Dành cho HR)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Post('join/:companyId')
  sendJoin(@Request() req, @Param('companyId') companyId: string) {
    return this.companyService.sendJoinRequest(req.user.userId, companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách yêu cầu gia nhập (Chủ sở hữu)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Get('my-company/requests')
  getRequests(@Request() req, @Query() pagination: PaginationQueryDto) {
    return this.companyService.getMyCompanyRequests(
      req.user.userId,
      pagination,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách thành viên công ty (Employer)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Get('my-company/members')
  getMembers(@Request() req, @Query() pagination: PaginationQueryDto) {
    return this.companyService.getMembers(req.user.userId, pagination);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Phân công thành viên phụ trách tin tuyển dụng (Chủ sở hữu)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Post('jobs/:jobId/assignees')
  assignMemberToJob(
    @Request() req,
    @Param('jobId') jobId: string,
    @Body() dto: JobAssigneeDto,
  ) {
    return this.companyService.assignMemberToJob(
      req.user.userId,
      jobId,
      dto.userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Delete('jobs/:jobId/assignees/:userId')
  unassignMemberFromJob(
    @Request() req,
    @Param('jobId') jobId: string,
    @Param('userId') userId: string,
  ) {
    return this.companyService.unassignMemberFromJob(
      req.user.userId,
      jobId,
      userId,
    );
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
  findAllForAdmin(@Query() query: AdminCompanyQueryDto) {
    return this.companyService.findAllForAdmin(query);
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

  // ==========================================
  // PREMIUM REQUESTS
  // ==========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Post('premium-request')
  createPremiumRequest(@Request() req, @Body() dto: CreatePremiumRequestDto) {
    return this.companyService.createPremiumRequest(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/premium-requests')
  findAllPremiumRequests(
    @Query() query: PaginationQueryDto & { status?: PremiumRequestStatus },
  ) {
    const { status, ...pagination } = query;
    return this.companyService.findAllPremiumRequests(pagination, status);
  }

  @ApiOperation({ summary: 'Lấy thống kê hệ thống (Dành cho Admin Dashboard)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/stats')
  getAdminStats() {
    return this.companyService.getAdminStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('premium-request/:id/handle')
  handlePremiumRequest(
    @Param('id') id: string,
    @Body('status') status: PremiumRequestStatus,
  ) {
    return this.companyService.handlePremiumRequest(id, status);
  }
}
