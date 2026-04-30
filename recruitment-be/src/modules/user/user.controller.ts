import { 
  Controller, Get, Patch, Body, UseGuards, Request, 
  UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserDto } from './dto/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@Request() req) {
    return this.userService.getMe(req.user.userId);
  }

  @Patch('profile')
  updateProfile(@Request() req, @Body() data: UserDto) {
    return this.userService.updateProfile(req.user.userId, data);
  }

  @Patch('avatar')
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
    ) file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(req.user.userId, file);
  }
}