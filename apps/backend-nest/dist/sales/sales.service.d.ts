import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, storeId: number, dto: CreateSaleDto): Promise<{
        id: number;
        storeId: number;
        userId: number;
        createdAt: Date;
        terminalId: number | null;
        customerId: number | null;
        total: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
    }>;
    findOne(id: number): Promise<({
        items: {
            price: import("@prisma/client/runtime/library").Decimal;
            id: number;
            productId: number;
            quantity: number;
            discount: import("@prisma/client/runtime/library").Decimal;
            saleId: number;
            subtotal: import("@prisma/client/runtime/library").Decimal;
        }[];
        payments: {
            id: number;
            amount: import("@prisma/client/runtime/library").Decimal;
            saleId: number;
            method: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: number;
        storeId: number;
        userId: number;
        createdAt: Date;
        terminalId: number | null;
        customerId: number | null;
        total: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
    }) | null>;
    refund(originalSaleId: number, userId: number, storeId: number, items: {
        productId: number;
        quantity: number;
    }[]): Promise<{
        id: number;
        storeId: number;
        userId: number;
        createdAt: Date;
        terminalId: number | null;
        customerId: number | null;
        total: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
    }>;
}
