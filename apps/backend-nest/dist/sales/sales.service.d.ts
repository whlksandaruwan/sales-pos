import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, storeId: number, dto: CreateSaleDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        storeId: number;
        total: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        terminalId: number | null;
        customerId: number | null;
    }>;
    findOne(id: number): Promise<({
        items: {
            id: number;
            price: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            saleId: number;
            productId: number;
            quantity: number;
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
        createdAt: Date;
        userId: number;
        storeId: number;
        total: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        terminalId: number | null;
        customerId: number | null;
    }) | null>;
}
