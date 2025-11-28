import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { RefundSaleDto } from './dto/refund-sale.dto';
export declare class SalesController {
    private salesService;
    constructor(salesService: SalesService);
    create(req: any, dto: CreateSaleDto): Promise<{
        id: number;
        storeId: number;
        userId: number;
        createdAt: Date;
        terminalId: number | null;
        customerId: number | null;
        total: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
    }>;
    getById(id: string): Promise<({
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
    refund(req: any, id: string, dto: RefundSaleDto): Promise<{
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
