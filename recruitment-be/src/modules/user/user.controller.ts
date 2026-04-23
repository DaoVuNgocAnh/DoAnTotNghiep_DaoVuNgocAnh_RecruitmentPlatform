import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
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
}