import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { secureBullUiMiddleware } from './bull-ui-secure.middleware';

@Injectable()
export class BullDashboardService {
  constructor(@InjectQueue('mail') private mailQueue: Queue) {}

  setupBullBoard(app: NestExpressApplication) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [new BullAdapter(this.mailQueue)],
      serverAdapter,
    });

    app.use(
      '/admin/queues',
      ...secureBullUiMiddleware,
      serverAdapter.getRouter(),
    );
  }
}
