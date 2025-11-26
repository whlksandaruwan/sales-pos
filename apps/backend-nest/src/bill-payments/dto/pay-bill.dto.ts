import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { FetchBillDto } from './fetch-bill.dto';

export class PayBillDto extends FetchBillDto {
  @ApiProperty()
  @IsNumber()
  amount: number;
}


