// order.controller.ts
import {
  Controller, Post, Body, UseGuards, Req, Get
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  create(@Body() dto: CreateOrderDto, @Req() req) {
    return this.orderService.createOrder(dto, req.user);
  }

  @Get('me')
  getMyOrders(@Req() req) {
    return this.orderService.getMyOrders(req.user.sub);
  }
}
