import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';

@Module({
  imports: [HttpModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}


