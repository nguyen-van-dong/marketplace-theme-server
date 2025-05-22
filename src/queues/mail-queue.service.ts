// src/queues/mail-queue.service.ts
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailQueueService {
  constructor(@InjectQueue('mail') private mailQueue: Queue) { }

  async sendVerificationEmail(data: {
    email: string;
    name: string;
    verificationToken: string;
  }) {
    await this.mailQueue.add('sendVerificationEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  async sendResetPasswordEmail(data: {
    email: string;
    name: string;
    resetToken: string;
  }) {
    const { email, name, resetToken } = data;

    await this.mailQueue.add('sendResetPasswordEmail', { email, name, resetToken });
  }
}
