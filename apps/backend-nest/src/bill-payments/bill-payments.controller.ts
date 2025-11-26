import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BillPaymentsService } from './bill-payments.service';
import { FetchBillDto } from './dto/fetch-bill.dto';
import { PayBillDto } from './dto/pay-bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../auth/roles.enum';

@ApiTags('BillPayments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bill-payments')
export class BillPaymentsController {
  constructor(private service: BillPaymentsService) {}

  @Post('fetch')
  @Roles(RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Cashier)
  async fetch(@Body() dto: FetchBillDto) {
    return this.service.fetch(dto);
  }

  @Post('pay')
  @Roles(RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Cashier)
  async pay(
    @Req() req: any,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() dto: PayBillDto,
  ) {
    const user = req.user as { id: number };
    const storeId = 1;
    return this.service.pay(user.id, storeId, dto, idempotencyKey);
  }
}


