import { Module } from '@nestjs/common';
import { BillPaymentsService } from './bill-payments.service';
import { BillPaymentsController } from './bill-payments.controller';

@Module({
  controllers: [BillPaymentsController],
  providers: [BillPaymentsService],
})
export class BillPaymentsModule {}


