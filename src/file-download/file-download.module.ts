import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Download } from '../downloads/download.entity';
import { FileDownloadController } from './file-download.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Download])],
  controllers: [FileDownloadController],
})
export class FileDownloadModule {}