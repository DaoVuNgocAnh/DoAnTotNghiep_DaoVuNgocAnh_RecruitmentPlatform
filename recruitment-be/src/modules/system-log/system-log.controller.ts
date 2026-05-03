import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SystemLogService } from './system-log.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SystemLogQueryDto } from './dto/system-log.dto';

@Controller('system-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SystemLogController {
  constructor(private readonly systemLogService: SystemLogService) {}

  @Get()
  async findAll(@Query() query: SystemLogQueryDto) {
    return this.systemLogService.findAll(query);
  }
}
