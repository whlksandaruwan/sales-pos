import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrintStickerDto } from './dto/print-sticker.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    getByBarcode(code: string): Promise<{
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
    update(id: string, dto: UpdateProductDto): Promise<{
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
