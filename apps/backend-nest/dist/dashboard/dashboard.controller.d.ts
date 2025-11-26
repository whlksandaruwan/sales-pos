import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardController {
    private prisma;
    constructor(prisma: PrismaService);
    lowStock(): Promise<({
        stock: {
            id: number;
            productId: number;
            storeId: number;
            quantity: number;
        }[];
    } & {
        id: number;
        name: string;
        sku: string;
        isbn: string | null;
        barcode: string;
        categoryId: number | null;
        supplierId: number | null;
        price: import("@prisma/client/runtime/library").Decimal;
        cost: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        reorderThreshold: number;
    })[]>;
}
