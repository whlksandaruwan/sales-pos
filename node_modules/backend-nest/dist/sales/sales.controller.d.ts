import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesController {
    private salesService;
    constructor(salesService: SalesService);
    create(req: any, dto: CreateSaleDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        storeId: number;
        total: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        terminalId: number | null;
        customerId: number | null;
    }>;
    getById(id: string): Promise<({
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
