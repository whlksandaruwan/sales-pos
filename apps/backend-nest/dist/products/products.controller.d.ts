import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrintStickerDto } from './dto/print-sticker.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    getAll(q?: string): Promise<({
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
        price: import("@prisma/client/runtime/library").Decimal;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        id: number;
        categoryId: number | null;
        supplierId: number | null;
    })[]>;
    getByBarcode(code: string): Promise<{
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        price: import("@prisma/client/runtime/library").Decimal;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        id: number;
        categoryId: number | null;
        supplierId: number | null;
    }>;
    create(dto: CreateProductDto): Promise<{
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        price: import("@prisma/client/runtime/library").Decimal;
        cost: import("@prisma/client/runtime/library").Decimal;
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
        price: import("@prisma/client/runtime/library").Decimal;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        id: number;
        categoryId: number | null;
        supplierId: number | null;
    }[]>;
    update(id: string, dto: UpdateProductDto): Promise<{
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        price: import("@prisma/client/runtime/library").Decimal;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        id: number;
        categoryId: number | null;
        supplierId: number | null;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    printSticker(dto: PrintStickerDto): Promise<{
        success: boolean;
        job: {
            productIds: number[];
        };
    }>;
}
