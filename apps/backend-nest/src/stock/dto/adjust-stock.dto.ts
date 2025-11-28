import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class AdjustStockDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  storeId: number;

  @ApiProperty({ description: 'Quantity to adjust (positive to add, negative to remove)' })
  @IsNumber()
  quantity: number;
}

