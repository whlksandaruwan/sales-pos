import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardController {
    private prisma;
    constructor(prisma: PrismaService);
    lowStock(): Promise<({
        stock: {
            id: number;
            storeId: number;
            productId: number;
            quantity: number;
        }[];
    } & {
        id: number;
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        price: import("@prisma/client/runtime/library").Decimal;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
        categoryId: number | null;
        supplierId: number | null;
    })[]>;
}
