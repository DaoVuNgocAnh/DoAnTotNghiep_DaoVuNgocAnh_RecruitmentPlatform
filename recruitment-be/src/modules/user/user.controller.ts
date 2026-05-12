import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserDto } from './dto/user.dto';
import { Role, UserStatus } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Lấy thông tin cá nhân (Profile) của người dùng hiện tại' })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req) {
    return this.userService.getMe(req.user.userId);
  }

  @ApiOperation({ summary: 'Lấy danh sách tất cả user (Dành cho Admin)' })
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAllForAdmin(
    @Query() query: PaginationQueryDto & { role?: Role | 'ALL'; status?: UserStatus | 'ALL'; search?: string },
  ) {
    return this.userService.findAllForAdmin(query);
  }

  @ApiOperation({ summary: 'Đổi trạng thái tài khoản User (Dành cho Admin)' })
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateStatusByAdmin(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
  ) {
    return this.userService.updateStatusByAdmin(id, status);
  }

  @ApiOperation({ summary: 'Xem profile công khai của một ứng viên' })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getCandidateById(@Request() req, @Param('id') id: string) {
    return this.userService.getCandidateById(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin profile cá nhân' })
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() data: UserDto) {
    return this.userService.updateProfile(req.user.userId, data);
  }

  @ApiOperation({ summary: 'Upload Avatar người dùng (Tối đa 2MB, định dạng jpg/png)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Patch('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
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
    return this.userService.updateAvatar(req.user.userId, file);
  }
}
