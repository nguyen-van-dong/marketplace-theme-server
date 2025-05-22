// src/orders/order-item.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne
} from 'typeorm';
import { Order } from './order.entity';
import { Template } from '../templates/template.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  @ManyToOne(() => Template)
  template: Template;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;
}
