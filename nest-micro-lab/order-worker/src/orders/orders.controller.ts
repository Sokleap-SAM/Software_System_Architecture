import { Body, Controller, Delete, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Notify } from 'src/notifications/notify.decorator';
import { VerifyCustomerPipe } from 'src/modules/customers/pipes/verify-customer.pipe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Notify('Orders', 'order_created')
  create(@Body(VerifyCustomerPipe) body: any) {
    return this.ordersService.createOrder(body);
  }

  @Delete()
  delete() {
    return this.ordersService.deleteOrder();
  }
}
