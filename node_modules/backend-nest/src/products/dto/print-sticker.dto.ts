import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class PrintStickerDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  productIds: number[];
}


