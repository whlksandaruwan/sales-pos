import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsController {
    private prisma;
    constructor(prisma: PrismaService);
    sales(period?: 'daily' | 'weekly' | 'monthly'): Promise<({
        items: {
            id: number;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: number;
            quantity: number;
            discount: import("@prisma/client/runtime/library").Decimal;
            saleId: number;
            subtotal: import("@prisma/client/runtime/library").Decimal;
        }[];
        payments: {
            id: number;
            saleId: number;
            method: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: number;
        storeId: number;
        terminalId: number | null;
        userId: number;
        customerId: number | null;
        total: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
    })[]>;
    pnl(): Promise<{
        revenue: number;
        cost: number;
        profit: number;
    }>;
}
