import { Controller, Post, Get, Body, UseGuards, Req, Query, Param, Patch, ForbiddenException } from '@nestjs/common';
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

  @Patch('company/candidates/:id/note')
  updateCompanyNote(
    @Req() req,
    @Param('id') id: string,
    @Body('note') note: string,
  ) {
    if (!req.user.companyId) throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.savedItemsService.updateCompanyNote(req.user.userId, req.user.companyId, id, note);
  }

  @Post('company/candidates/toggle/:candidateId')
  toggleCompanyCandidate(@Req() req, @Param('candidateId') candidateId: string) {
    if (!req.user.companyId) throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.savedItemsService.toggleCompanyCandidate(req.user.userId, req.user.companyId, candidateId);
  }

  @Get('company/candidates')
  findCompanyCandidates(@Req() req) {
    if (!req.user.companyId) throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.savedItemsService.findCompanyCandidates(req.user.userId, req.user.companyId);
  }

  @Get('company/candidates/check/:targetId')
  checkCompanyCandidate(@Req() req, @Param('targetId') targetId: string) {
    if (!req.user.companyId) throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.savedItemsService.checkCompanyCandidate(req.user.companyId, targetId);
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
