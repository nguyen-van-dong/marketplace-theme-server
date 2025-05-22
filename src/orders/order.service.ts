// order.service.ts
import {
  Injectable, NotFoundException, BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Template } from '../templates/template.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Template) private templateRepo: Repository<Template>,
  ) {}

  async createOrder(dto: CreateOrderDto, user: User) {
    const templates = await this.templateRepo.find({
      where: { id: In(dto.templateIds), status: 'published' },
    });

    if (!templates.length) {
      throw new NotFoundException('Không tìm thấy template');
    }

    const total = templates.reduce((sum, t) => sum + Number(t.price), 0);

    const order = this.orderRepo.create({
      user,
      total_price: total,
      payment_status: 'paid', // giả định luôn thành công, sau này tích hợp cổng thanh toán
      items: templates.map(template => this.orderItemRepo.create({
        template,
        unit_price: template.price,
      })),
    });

    return this.orderRepo.save(order);
  }

  async getMyOrders(userId: string) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.template'],
      order: { created_at: 'DESC' },
    });
  }
}
