// template.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepo: Repository<Template>,
  ) {}

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

  async create(dto: CreateTemplateDto, userId: string): Promise<Template> {
    const template = this.templateRepo.create({ ...dto, user: { id: userId } });
    return this.templateRepo.save(template);
  }

  async update(id: string, dto: UpdateTemplateDto): Promise<Template> {
    await this.templateRepo.update(id, dto);
    return this.templateRepo.findOneByOrFail({ id });
  }

  async remove(id: string) {
    return this.templateRepo.delete(id);
  }
}
