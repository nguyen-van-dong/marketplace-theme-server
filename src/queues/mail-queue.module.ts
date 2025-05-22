import { Module } from '@nestjs/common';
import { MailQueueService } from './mail-queue.service';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        BullModule.registerQueue({ name: 'mail' }),
    ],
    providers: [MailQueueService],
    exports: [MailQueueService],
})
export class MailQueueModule { }
