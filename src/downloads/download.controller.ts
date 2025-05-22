// download.controller.ts
import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { DownloadService } from './download.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('downloads')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get('template/:id')
  download(@Param('id') templateId: string, @Req() req) {
    return this.downloadService.generateDownloadLink(templateId, req.user);
  }
}
