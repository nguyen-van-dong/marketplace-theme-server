import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullDashboardService } from './bull-dashboard.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'mail' }), // phải có để inject được
  ],
  providers: [BullDashboardService],
})
export class BullDashboardModule {}
