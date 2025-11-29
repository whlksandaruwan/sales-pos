import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesService {
    private prisma;
    private http;
    constructor(prisma: PrismaService, http: HttpService);
    create(userId: number, storeId: number, dto: CreateSaleDto): Promise<{
        total: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        deliveryDate: Date | null;
        deliveryNote: string | null;
        id: number;
        storeId: number;
        terminalId: number | null;
        userId: number;
        customerId: number | null;
    }>;
    findOne(id: number): Promise<({
        items: {
            discount: import("@prisma/client/runtime/library").Decimal;
            id: number;
            saleId: number;
            productId: number;
            quantity: number;
            price: import("@prisma/client/runtime/library").Decimal;
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
        total: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        deliveryDate: Date | null;
        deliveryNote: string | null;
        id: number;
        storeId: number;
        terminalId: number | null;
        userId: number;
        customerId: number | null;
    }) | null>;
    refund(originalSaleId: number, userId: number, storeId: number, items: {
        productId: number;
        quantity: number;
    }[]): Promise<{
        total: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        deliveryDate: Date | null;
        deliveryNote: string | null;
        id: number;
        storeId: number;
        terminalId: number | null;
        userId: number;
        customerId: number | null;
    }>;
}
