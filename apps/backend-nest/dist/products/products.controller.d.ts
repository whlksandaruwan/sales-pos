import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrintStickerDto } from './dto/print-sticker.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    getAll(q?: string): Promise<({
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
        price: import("@prisma/client/runtime/library").Decimal;
        sku: string;
        isbn: string | null;
        barcode: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        categoryId: number | null;
        supplierId: number | null;
    })[]>;
    getByBarcode(code: string): Promise<{
        id: number;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        sku: string;
        isbn: string | null;
        barcode: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        categoryId: number | null;
        supplierId: number | null;
    }>;
    create(dto: CreateProductDto): Promise<{
        id: number;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        sku: string;
        isbn: string | null;
        barcode: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        categoryId: number | null;
        supplierId: number | null;
    }>;
    bulkCreate(dtos: CreateProductDto[]): Promise<{
        id: number;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        sku: string;
        isbn: string | null;
        barcode: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        categoryId: number | null;
        supplierId: number | null;
    }[]>;
    update(id: string, dto: UpdateProductDto): Promise<{
        id: number;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        sku: string;
        isbn: string | null;
        barcode: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        categoryId: number | null;
        supplierId: number | null;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    printSticker(dto: PrintStickerDto): Promise<{
        success: boolean;
        productIds: number[];
    }>;
}
