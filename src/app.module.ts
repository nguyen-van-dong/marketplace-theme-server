import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TemplateModule } from './templates/template.module';
import { OrderModule } from './orders/order.module';
import { DownloadModule } from './downloads/download.module';
import { FileDownloadModule } from './file-download/file-download.module';
import { CustomMailerModule } from './mailer/mailer.module';
import { BullModule } from '@nestjs/bull';
import { MailQueueModule } from './queues/mail-queue.module';
import { BullDashboardModule } from './bull-dashboard/bull-dashboard.module';
import { CategoryModule } from './categories/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    AuthModule,
    CategoryModule,
    TemplateModule,
    OrderModule,
    DownloadModule,
    FileDownloadModule,
    CustomMailerModule,
    MailQueueModule,
    BullDashboardModule,
  ],
})
export class AppModule { }
