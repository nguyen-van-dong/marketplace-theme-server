// order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Template } from '../templates/template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Template])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
