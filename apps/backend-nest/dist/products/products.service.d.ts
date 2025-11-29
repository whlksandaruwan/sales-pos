import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateBarcode;
    create(dto: CreateProductDto): Promise<{
        id: number;
        name: string;
        price: Prisma.Decimal;
        sku: string;
        isbn: string | null;
        barcode: string;
        cost: Prisma.Decimal;
        unit: string;
        reorderThreshold: number;
        categoryId: number | null;
        supplierId: number | null;
    }>;
    bulkCreate(dtos: CreateProductDto[]): Promise<{
        id: number;
        name: string;
        price: Prisma.Decimal;
        sku: string;
        isbn: string | null;
        barcode: string;
        cost: Prisma.Decimal;
        unit: string;
        reorderThreshold: number;
        categoryId: number | null;
        supplierId: number | null;
    }[]>;
    update(id: number, dto: UpdateProductDto): Promise<{
        id: number;
        name: string;
        price: Prisma.Decimal;
        sku: string;
        isbn: string | null;
        barcode: string;
        cost: Prisma.Decimal;
        unit: string;
        reorderThreshold: number;
        categoryId: number | null;
        supplierId: number | null;
    }>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
    findByBarcode(code: string): Promise<{
        id: number;
        name: string;
        price: Prisma.Decimal;
        sku: string;
        isbn: string | null;
        barcode: string;
        cost: Prisma.Decimal;
        unit: string;
        reorderThreshold: number;
        categoryId: number | null;
        supplierId: number | null;
    }>;
    findAll(query?: string): Promise<({
        category: {
            id: number;
            name: string;
        } | null;
        stock: {
            id: number;
            storeId: number;
            productId: number;
            quantity: number;
        }[];
    } & {
        id: number;
        name: string;
        price: Prisma.Decimal;
        sku: string;
        isbn: string | null;
        barcode: string;
        cost: Prisma.Decimal;
        unit: string;
        reorderThreshold: number;
        categoryId: number | null;
        supplierId: number | null;
    })[]>;
}
