import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UserRegisterEvent } from '../events/user-register.event';
import { MailQueueService } from '../../queues/mail-queue.service';

@Injectable()
export class UserRegisterListener {
  constructor(private readonly mailQueue: MailQueueService) {}

  @OnEvent('user.registered')
  async handleUserRegistered(event: UserRegisterEvent) {
    await this.mailQueue.sendVerificationEmail(event);
  }
}
