import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
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
      include: { items: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}


