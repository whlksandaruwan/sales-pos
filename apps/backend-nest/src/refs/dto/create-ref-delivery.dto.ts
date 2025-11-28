import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateRefDeliveryDto {
  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  billNumber?: string;

  @ApiProperty({ required: false, description: 'Bill date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  billDate?: string;

  @ApiProperty({
    required: false,
    description: 'Bill photo URL or file reference',
  })
  @IsOptional()
  @IsString()
  billImageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}


