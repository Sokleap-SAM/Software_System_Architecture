import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Notify } from 'src/notifications/notify.decorator';
import { VerifyCustomerPipe } from 'src/modules/customers/pipes/verify-customer.pipe';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @Notify('Orders', 'order_created')
  create(@Body(VerifyCustomerPipe) body: any) {
    return this.ordersService.createOrder(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete() {
    return this.ordersService.deleteOrder();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any) {
    return { user: req.user, orders: [] };
  }
}
