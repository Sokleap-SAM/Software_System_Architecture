import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly processedOrders: any[] = []; // simple "DB"

  // Optional: method to view "DB" in logs
  printAll() {
    this.logger.log(
      `All processed orders: ${JSON.stringify(this.processedOrders)}`,
    );
  }
}
