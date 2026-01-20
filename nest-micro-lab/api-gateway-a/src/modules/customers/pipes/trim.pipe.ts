import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (value === null || value === undefined) {
      throw new BadRequestException('Full Name is required');
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('Full Name must be a string');
    }

    const trimValue = value.trim();

    if (trimValue.length === 0) {
      throw new BadRequestException(
        'Full Name cannot be empty or whitespace only',
      );
    }

    return trimValue;
  }
}
