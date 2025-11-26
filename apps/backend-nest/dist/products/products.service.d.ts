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
        sku: string;
        isbn: string | null;
        barcode: string;
        categoryId: number | null;
        price: import("@prisma/client/runtime/library").Decimal;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        supplierId: number | null;
    }>;
    update(id: number, dto: UpdateProductDto): Promise<{
        id: number;
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        categoryId: number | null;
        price: import("@prisma/client/runtime/library").Decimal;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        supplierId: number | null;
    }>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
    findByBarcode(code: string): Promise<{
        id: number;
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        categoryId: number | null;
        price: import("@prisma/client/runtime/library").Decimal;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        supplierId: number | null;
    }>;
}
