// template.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './template.entity';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { CategoryService } from 'src/categories/category.service';
import { CategoryModule } from 'src/categories/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Template]),
    CategoryModule,
  ],
  providers: [TemplateService],
  controllers: [TemplateController],
})
export class TemplateModule {}
