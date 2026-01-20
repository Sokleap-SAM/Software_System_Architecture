import {
  PipeTransform,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CustomersService } from '../customers.service';

@Injectable()
export class VerifyCustomerPipe implements PipeTransform {
  constructor(private readonly customersService: CustomersService) {}

  transform(value: any) {
    if (typeof value !== 'object' || value === null) {
      throw new BadRequestException('Invalid request body');
    }

    const fullName = value.fullName?.toString().trim() || '';
    if (fullName.length === 0) {
      throw new BadRequestException('Full Name cannot be empty');
    }

    const rawPhone = value.phone?.toString() || '';
    const numberOnly = rawPhone.replace(/\s/g, '');
    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(numberOnly)) {
      throw new BadRequestException('Phone must be 9-10 digits');
    }
    const phone = numberOnly.replace(/^0+/, '+855');

    const dob = value.dob?.toString() || '';
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(dob)) {
      throw new BadRequestException('Date must be dd/mm/yyyy');
    }

    const [day, month, year] = dob.split('/').map(Number);
    if (year >= 2010) {
      throw new BadRequestException('Year must be lower than 2010');
    }

    const nationalId = value.nationalId?.toString() || '';

    if (this.customersService.isBlockedPhone(phone)) {
      throw new ForbiddenException('This phone number is blacklisted');
    }
    if (this.customersService.isBlockedName(fullName)) {
      throw new ForbiddenException('This user name is blocked');
    }
    if (this.customersService.isBlockedNationalId(nationalId)) {
      throw new ForbiddenException('National ID is blocked');
    }

    return {
      ...value,
      fullName,
      phone,
      nationalId,
      dob,
    };
  }
}
