// src/auth/listeners/user-forgot-password.listener.ts
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UserForgotPasswordEvent } from '../events/user-forgot-password.event';
import { MailQueueService } from '../../queues/mail-queue.service';

@Injectable()
export class UserForgotPasswordListener {
  constructor(private readonly mailQueue: MailQueueService) {}

  @OnEvent('user.forgot_password')
  async handleForgotPassword(event: UserForgotPasswordEvent) {
    await this.mailQueue.sendResetPasswordEmail(event);
  }
}
