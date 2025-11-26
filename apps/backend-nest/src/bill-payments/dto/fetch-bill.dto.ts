import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export enum BillProvider {
  Electricity = 'electricity',
  Water = 'water',
  Mobile = 'mobile',
}

export class FetchBillDto {
  @ApiProperty({ enum: BillProvider })
  @IsEnum(BillProvider)
  provider: BillProvider;

  @ApiProperty()
  @IsString()
  reference: string;
}


