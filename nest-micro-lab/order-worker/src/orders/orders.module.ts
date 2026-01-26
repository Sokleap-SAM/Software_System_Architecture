import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { CustomersModule } from 'src/modules/customers/customers.module';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    CustomersModule,
    forwardRef(() => PaymentsModule),
    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
          queue: 'orders_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
    NotificationsModule.forFeature({
      featureName: 'Orders',
      prefix: '[ORDERS]',
      channels: ['log', 'telegram'],
      enable: true,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtStrategy],
  exports: [OrdersService],
})
export class OrdersModule {}
