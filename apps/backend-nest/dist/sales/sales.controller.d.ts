import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { RefundSaleDto } from './dto/refund-sale.dto';
export declare class SalesController {
    private salesService;
    constructor(salesService: SalesService);
    create(req: any, dto: CreateSaleDto): Promise<{
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
    getById(id: string): Promise<({
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
    refund(req: any, id: string, dto: RefundSaleDto): Promise<{
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
