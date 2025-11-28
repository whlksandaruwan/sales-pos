import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getByProduct(productId: number) {
    return this.prisma.stock.findMany({
      where: { productId },
      include: { store: true },
    });
  }

  async adjust(productId: number, storeId: number, quantity: number, userId: number) {
    const existing = await this.prisma.stock.findUnique({
      where: { productId_storeId: { productId, storeId } },
    });

    let result;
    if (existing) {
      result = await this.prisma.stock.update({
        where: { productId_storeId: { productId, storeId } },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      result = await this.prisma.stock.create({
        data: { productId, storeId, quantity: Math.max(0, quantity) },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'STOCK_ADJUSTED',
        entity: 'Stock',
        entityId: result.id,
        data: { productId, storeId, quantity } as any,
      },
    });

    return result;
  }

  async set(productId: number, storeId: number, quantity: number, userId: number) {
    const existing = await this.prisma.stock.findUnique({
      where: { productId_storeId: { productId, storeId } },
    });

    let result;
    if (existing) {
      result = await this.prisma.stock.update({
        where: { productId_storeId: { productId, storeId } },
        data: { quantity },
      });
    } else {
      result = await this.prisma.stock.create({
        data: { productId, storeId, quantity: Math.max(0, quantity) },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'STOCK_SET',
        entity: 'Stock',
        entityId: result.id,
        data: { productId, storeId, quantity } as any,
      },
    });

    return result;
  }
}

