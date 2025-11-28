import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateBarcode;
    create(dto: CreateProductDto): Promise<{
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        price: Prisma.Decimal;
        cost: Prisma.Decimal;
        unit: string;
        reorderThreshold: number;
        id: number;
        categoryId: number | null;
        supplierId: number | null;
    }>;
    bulkCreate(dtos: CreateProductDto[]): Promise<{
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        price: Prisma.Decimal;
        cost: Prisma.Decimal;
        unit: string;
        reorderThreshold: number;
        id: number;
        categoryId: number | null;
        supplierId: number | null;
    }[]>;
    update(id: number, dto: UpdateProductDto): Promise<{
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        price: Prisma.Decimal;
        cost: Prisma.Decimal;
        unit: string;
        reorderThreshold: number;
        id: number;
        categoryId: number | null;
        supplierId: number | null;
    }>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
    findByBarcode(code: string): Promise<{
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        price: Prisma.Decimal;
        cost: Prisma.Decimal;
        unit: string;
        reorderThreshold: number;
        id: number;
        categoryId: number | null;
        supplierId: number | null;
    }>;
    findAll(query?: string): Promise<({
        category: {
            name: string;
            id: number;
        } | null;
        stock: {
            id: number;
            productId: number;
            storeId: number;
            quantity: number;
        }[];
    } & {
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        price: Prisma.Decimal;
        cost: Prisma.Decimal;
        unit: string;
        reorderThreshold: number;
        id: number;
        categoryId: number | null;
        supplierId: number | null;
    })[]>;
}
