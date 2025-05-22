// src/mailer/mailer.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
   MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get<string>('MAIL_FROM')}>`,
        },
      }),
    })
  ],
  providers: [MailService],
  exports: [MailService],
})
export class CustomMailerModule {}
