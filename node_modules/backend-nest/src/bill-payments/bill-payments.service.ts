import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FetchBillDto } from './dto/fetch-bill.dto';
import { PayBillDto } from './dto/pay-bill.dto';

@Injectable()
export class BillPaymentsService {
  constructor(private prisma: PrismaService) {}

  async fetch(dto: FetchBillDto) {
    // In a real system, call provider API; here we mock
    return {
      provider: dto.provider,
      reference: dto.reference,
      amount: 100.0,
      currency: 'USD',
      status: 'PENDING',
    };
  }

  async pay(userId: number, storeId: number, dto: PayBillDto, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = await this.prisma.billPayment.findFirst({
        where: { provider: dto.provider, reference: dto.reference },
      });
      if (existing) return existing;
    }
    const record = await this.prisma.billPayment.create({
      data: {
        provider: dto.provider,
        reference: dto.reference,
        amount: dto.amount,
        status: 'PAID',
        userId,
        storeId,
      },
    });
    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'BILL_PAID',
        entity: 'BillPayment',
        entityId: record.id,
        data: dto as any,
      },
    });
    return record;
  }
}


