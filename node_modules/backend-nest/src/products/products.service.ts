import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private generateBarcode(): string {
    return `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
  }

  async create(dto: CreateProductDto) {
    const barcode = dto.barcode || this.generateBarcode();
    return this.prisma.product.create({
      data: {
        name: dto.name,
        sku: dto.sku,
        isbn: dto.isbn,
        barcode,
        categoryId: dto.categoryId,
        price: dto.price,
        cost: dto.cost,
        unit: dto.unit,
        reorderThreshold: dto.reorderThreshold,
      },
    });
  }

  async bulkCreate(dtos: CreateProductDto[]) {
    if (!dtos || dtos.length === 0) return [];
    return this.prisma.$transaction(
      dtos.map((dto) => {
        const barcode = dto.barcode || this.generateBarcode();
        return this.prisma.product.create({
          data: {
            name: dto.name,
            sku: dto.sku,
            isbn: dto.isbn,
            barcode,
            categoryId: dto.categoryId,
            price: dto.price,
            cost: dto.cost,
            unit: dto.unit,
            reorderThreshold: dto.reorderThreshold,
          },
        });
      }),
    );
  }

  async update(id: number, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }

  async findByBarcode(code: string) {
    const product = await this.prisma.product.findFirst({
      where: { barcode: code },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findAll(query?: string) {
    return this.prisma.product.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { sku: { contains: query, mode: 'insensitive' } },
              { isbn: { contains: query, mode: 'insensitive' } },
              { barcode: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: { stock: true, category: true },
      orderBy: { name: 'asc' },
    });
  }
}


