// template.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CategoryService } from 'src/categories/category.service';
import slugify from 'slugify';
import { extname } from 'path';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepo: Repository<Template>,
    private categoryService: CategoryService,
  ) { }

  async findAll(): Promise<Template[]> {
    return this.templateRepo.find({
      where: { status: 'published' },
      order: { created_at: 'DESC' },
    });
  }

  async findBySlug(slug: string): Promise<Template> {
    const template = await this.templateRepo.findOne({ where: { slug } });
    if (!template) throw new NotFoundException('Template không tồn tại');
    return template;
  }

  async create(dto: CreateTemplateDto, files: {
    zip: Express.Multer.File;
    thumbnail?: Express.Multer.File;
    preview?: Express.Multer.File;
  }) {
    const slug = slugify(dto.title, { lower: true, strict: true });

    const existed = await this.templateRepo.findOneBy({ slug });
    if (existed) throw new BadRequestException('Template name already exists');

    const category = await this.categoryService.findById(dto.categoryId);
    if (!category) throw new NotFoundException('Category does not exists!');

    const zipPath = this.saveFile(files.zip, 'zip');
    const thumbnailPath = files.thumbnail ? this.saveFile(files.thumbnail, 'thumbnail') : null;
    const previewPath = files.preview ? this.saveFile(files.preview, 'preview') : null;

    const template = this.templateRepo.create({
      ...dto,
      slug,
      category,
      download_path: zipPath,
      thumbnail_url: thumbnailPath,
      preview_url: previewPath,
    });

    return this.templateRepo.save(template);
  }

  saveFile(file: Express.Multer.File, subfolder: string): string {
    const fs = require('fs');
    const path = require('path');

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.originalname)}`;
    const dir = `./storage/templates/${subfolder}`;
    const fullPath = `${dir}/${filename}`;

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, file.buffer);

    return `/storage/templates/${subfolder}/${filename}`;
  }

  async update(id: string, dto: UpdateTemplateDto): Promise<Template> {
    await this.templateRepo.update(id, dto);
    return this.templateRepo.findOneByOrFail({ id });
  }

  async remove(id: string) {
    return this.templateRepo.delete(id);
  }
}
