import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRefDto } from './dto/create-ref.dto';
import { CreateRefDeliveryDto } from './dto/create-ref-delivery.dto';

@Injectable()
export class RefsService {
  constructor(private prisma: PrismaService) {}

  createRef(dto: CreateRefDto) {
    return this.prisma.ref.create({ data: dto });
  }

  listRefs() {
    return this.prisma.ref.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async addDelivery(refId: number, dto: CreateRefDeliveryDto) {
    const { companyName, billNumber, billDate, billImageUrl, notes } = dto;
    return this.prisma.refDelivery.create({
      data: {
        refId,
        companyName,
        billNumber,
        billImageUrl,
        notes,
        billDate: billDate ? new Date(billDate) : undefined,
      },
    });
  }

  listDeliveriesForRef(refId: number) {
    return this.prisma.refDelivery.findMany({
      where: { refId },
      orderBy: { createdAt: 'desc' },
    });
  }

  listAllDeliveries() {
    return this.prisma.refDelivery.findMany({
      include: {
        ref: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}


