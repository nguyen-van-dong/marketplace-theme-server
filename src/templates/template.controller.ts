// template.controller.ts
import {
  Controller, Get, Post, Param, Body, Put, Delete, UseGuards, Req,
  UploadedFiles,
  UseInterceptors,
  BadRequestException
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) { }

  @Get()
  getAll() {
    return this.templateService.findAll();
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.templateService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor({
    storage: memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // Optional: giới hạn 10MB/file
    }
  }))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateTemplateDto,
  ) {
    const zip = files.find(f => f.originalname.endsWith('.zip'));
    const thumbnail = files.find(f => f.fieldname === 'thumbnail');
    const preview = files.find(f => f.fieldname === 'preview');

    if (!zip) throw new BadRequestException('The file must be .zip file');

    return this.templateService.create(dto, {
      zip,
      thumbnail,
      preview,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTemplateDto) {
    return this.templateService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }
}
