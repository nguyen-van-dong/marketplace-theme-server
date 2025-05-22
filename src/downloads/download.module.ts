// download.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Download } from './download.entity';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { Template } from '../templates/template.entity';
import { Order } from '../orders/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Download, Template, Order])],
  providers: [DownloadService],
  controllers: [DownloadController],
})
export class DownloadModule {}
