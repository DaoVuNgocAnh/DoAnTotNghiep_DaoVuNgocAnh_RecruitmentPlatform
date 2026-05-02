import { Controller, Post, Get, Body, UseGuards, Req, Query, Param, Patch } from '@nestjs/common';
import { SavedItemsService } from './saved-items.service';
import { ToggleSavedItemDto } from './dto/toggle-saved-item.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TargetType } from '@prisma/client';

@Controller('saved-items')
@UseGuards(JwtAuthGuard)
export class SavedItemsController {
  constructor(private readonly savedItemsService: SavedItemsService) {}

  @Post('toggle')
  toggle(@Req() req, @Body() dto: ToggleSavedItemDto) {
    return this.savedItemsService.toggle(req.user.userId, dto);
  }

  @Patch(':id/note')
  updateNote(
    @Req() req,
    @Param('id') id: string,
    @Body('note') note: string,
  ) {
    return this.savedItemsService.updateNote(req.user.userId, id, note);
  }

  @Get()
  findAll(@Req() req, @Query('type') type?: TargetType) {
    return this.savedItemsService.findAll(req.user.userId, type);
  }

  @Get('check/:targetId')
  checkStatus(@Req() req, @Param('targetId') targetId: string) {
    return this.savedItemsService.checkStatus(req.user.userId, targetId);
  }
}
