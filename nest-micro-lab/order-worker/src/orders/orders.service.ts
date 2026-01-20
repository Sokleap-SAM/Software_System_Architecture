/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly client: ClientProxy,
    private readonly notifications: NotificationsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  createOrder(orderDto: any) {
    this.client.emit('order_created', {
      order: orderDto,
      createdAt: new Date().toISOString(),
    });

    return { status: 'Order accepted', orderDto };
  }

  deleteOrder() {
    this.client.emit('order_deleted', 'aaa');
    return { status: 'Order deleted' };
  }
}
