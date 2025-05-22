// src/orders/order.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'failed'], default: 'pending' })
  payment_status: 'pending' | 'paid' | 'failed';

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];
}
