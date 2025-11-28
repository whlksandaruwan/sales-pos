import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({ data: dto });
  }

  findAll() {
    return this.prisma.customer.findMany();
  }

  async findOne(id: number) {
    if (!id || Number.isNaN(id)) {
      throw new BadRequestException('Customer id is required');
    }
    return this.prisma.customer.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdateCustomerDto) {
    return this.prisma.customer.update({ where: { id }, data: dto });
  }

  async settleCredit(id: number, amount: number) {
    return this.prisma.customer.update({
      where: { id },
      data: { credit: { decrement: amount } },
    });
  }

  salesHistory(id: number) {
    return this.prisma.sale.findMany({
      where: { customerId: id },
      include: {
        items: { include: { product: true } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async productRefs() {
    return this.prisma.saleItem.findMany({
      include: {
        product: true,
        sale: {
          include: {
            customer: true,
            user: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }
}


