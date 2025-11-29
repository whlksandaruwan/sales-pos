import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto, PaymentMethod } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {}

  async create(userId: number, storeId: number, dto: CreateSaleDto) {
    return this.prisma.$transaction(async (tx) => {
      const gross = dto.items.reduce(
        (sum, item) =>
          sum +
          (item.price - (item.discount || 0)) * item.quantity,
        0,
      );
      const discount = dto.discount || 0;
      if (discount < 0 || discount > gross) {
        throw new BadRequestException('Invalid discount amount');
      }
      const total = gross - discount;

      const sale = await tx.sale.create({
        data: {
          storeId,
          userId,
          customerId: dto.customerId,
          total,
          discount,
        },
      });

      for (const item of dto.items) {
        const subtotal =
          (item.price - (item.discount || 0)) * item.quantity;
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount || 0,
            subtotal,
          },
        });
        await tx.stock.updateMany({
          where: { productId: item.productId, storeId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      for (const payment of dto.payments) {
        await tx.payment.create({
          data: {
            saleId: sale.id,
            method: payment.method,
            amount: payment.amount,
          },
        });
      }

      // Handle customer credit if payment method is Credit
      const creditPayment = dto.payments.find(
        (p) => p.method === PaymentMethod.Credit,
      );
      if (creditPayment && dto.customerId) {
        await tx.customer.update({
          where: { id: dto.customerId },
          data: {
            credit: {
              increment: creditPayment.amount,
            },
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: 'SALE_CREATED',
          entity: 'Sale',
          entityId: sale.id,
          data: dto as any,
        },
      });

      const hasCash = dto.payments.some(
        (p) => p.method === PaymentMethod.Cash && p.amount > 0,
      );

      const agentUrl =
        process.env.PRINT_AGENT_URL || 'http://localhost:4100';

      // Fire-and-forget receipt print
      const receiptLines: string[] = [];
      dto.items.forEach((item) => {
        const lineTotal =
          (item.price - (item.discount || 0)) * item.quantity;
        receiptLines.push(
          `${item.quantity} x Rs.${item.price.toFixed(
            2,
          )}  = Rs.${lineTotal.toFixed(2)}`,
        );
      });
      receiptLines.push(`TOTAL: Rs.${total.toFixed(2)}`);

      lastValueFrom(
        this.http.post(`${agentUrl}/print/receipt`, {
          title: 'Ahasna Sale Center',
          lines: receiptLines,
          footer: 'Software By INNOVATECH  0742256408',
        }),
      ).catch(() => undefined);

      // After transaction, try to open cash drawer if there was any cash payment
      if (hasCash) {
        lastValueFrom(
          this.http.post(`${agentUrl}/cash-drawer/open`, {
            saleId: sale.id,
            storeId,
            userId,
            total,
          }),
        ).catch(() => undefined);
      }

      return sale;
    });
  }

  async findOne(id: number) {
    return this.prisma.sale.findUnique({
      where: { id },
      include: { items: true, payments: true },
    });
  }

  async refund(
    originalSaleId: number,
    userId: number,
    storeId: number,
    items: { productId: number; quantity: number }[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const original = await tx.sale.findUnique({
        where: { id: originalSaleId },
        include: { items: true },
      });
      if (!original) {
        throw new Error('Original sale not found');
      }

      let totalRefund = 0;

      const refundSale = await tx.sale.create({
        data: {
          storeId,
          userId,
          customerId: original.customerId,
          total: 0,
          discount: 0,
        },
      });

      for (const reqItem of items) {
        const soldItem = original.items.find(
          (i) => i.productId === reqItem.productId,
        );
        if (!soldItem) continue;
        const qty = Math.min(reqItem.quantity, soldItem.quantity);
        if (qty <= 0) continue;

        const unitNet =
          Number(soldItem.price) - Number(soldItem.discount || 0);
        const subtotal = unitNet * qty * -1; // negative for refund
        totalRefund += subtotal;

        await tx.saleItem.create({
          data: {
            saleId: refundSale.id,
            productId: soldItem.productId,
            quantity: qty * -1,
            price: soldItem.price,
            discount: soldItem.discount,
            subtotal,
          },
        });

        await tx.stock.updateMany({
          where: { productId: soldItem.productId, storeId },
          data: { quantity: { increment: qty } },
        });
      }

      await tx.sale.update({
        where: { id: refundSale.id },
        data: { total: totalRefund },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: 'SALE_REFUNDED',
          entity: 'Sale',
          entityId: refundSale.id,
          data: { originalSaleId, items } as any,
        },
      });

      return refundSale;
    });
  }
}


