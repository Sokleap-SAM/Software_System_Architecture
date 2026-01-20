import { Body, Controller, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { DateValidationPipe } from './pipes/date-validation-pipe';
import { PhoneNormalizePipe } from './pipes/phone-normalize.pipe';
import { TrimPipe } from './pipes/trim.pipe';
import { CustomerNotBlockedPipe } from './pipes/customers-not-blocked.pipe';
import { VerifyCustomerPipe } from './pipes/verify-customer.pipe';

@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Post('create')
  create(
    @Body('dob', DateValidationPipe) dob: string,
    @Body('phone', PhoneNormalizePipe) phone: string,
    @Body('fullName', TrimPipe) fullName: string,
    @Body(CustomerNotBlockedPipe) createCustomerDto: CreateCustomerDto,
  ) {
    const finalCustomerData = {
      ...createCustomerDto,
      dob,
      phone,
      fullName,
    };
    return this.service.create(finalCustomerData);
  }

  @Post('verify')
  verify(@Body(VerifyCustomerPipe) body: VerifyCustomerPipe) {
    return {
      message: 'Customer verified successfully',
      data: body,
    };
  }
}
