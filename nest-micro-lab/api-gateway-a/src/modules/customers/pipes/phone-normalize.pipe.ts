import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PhoneNormalizePipe implements PipeTransform {
  transform(value: any) {
    if (value === null || value === undefined) {
      throw new BadRequestException('Phone number is required');
    }

    if (typeof value !== 'string') {
      console.log(value);
      throw new BadRequestException('Phone number must be a string');
    }

    const numberOnly = value.replace(/\s/g, '');
    const phoneRegex = /^[0-9]{9,10}$/;

    if (!phoneRegex.test(numberOnly)) {
      throw new BadRequestException(
        'Phone number must be 9 or 10 digits long and contain only numbers',
      );
    }

    const data = numberOnly.replace(/^0+/, '+855');

    return data;
  }
}
