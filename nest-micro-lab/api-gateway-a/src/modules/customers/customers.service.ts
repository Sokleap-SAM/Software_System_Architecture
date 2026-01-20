import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor() {}

  private readonly blockedPhones = ['+85512345678', '+855123456789'];
  private readonly blockedNames = ['Josh', 'John'];
  private readonly blockedNationalIds = ['11111', '000000'];

  isBlockedPhone(phone: string): boolean {
    return this.blockedPhones.includes(phone);
  }

  isBlockedName(name: string): boolean {
    return this.blockedNames.includes(name);
  }

  isBlockedNationalId(nationalId?: string): boolean {
    return nationalId ? this.blockedNationalIds.includes(nationalId) : false;
  }

  create(createCustomerDto: CreateCustomerDto) {
    return {
      message: 'Customer created successfully',
      data: createCustomerDto,
    };
  }
}
