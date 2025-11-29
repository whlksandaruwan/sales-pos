import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsController {
    private prisma;
    constructor(prisma: PrismaService);
    private getDateRange;
    sales(query: {
        period?: 'daily' | 'weekly' | 'monthly';
        from?: string;
        to?: string;
    }): Promise<({
        user: {
            createdAt: Date;
            id: number;
            email: string;
            passwordHash: string;
            fullName: string;
            roleId: number;
            updatedAt: Date;
        };
        customer: {
            id: number;
            name: string;
            email: string | null;
            phone: string | null;
            credit: import("@prisma/client/runtime/library").Decimal;
        } | null;
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
    })[]>;
    pnl(query: {
        period?: 'daily' | 'weekly' | 'monthly';
        from?: string;
        to?: string;
    }): Promise<{
        revenue: number;
        cost: number;
        profit: number;
    }>;
    categorySales(query: {
        period?: 'daily' | 'weekly' | 'monthly';
        from?: string;
        to?: string;
    }): Promise<{
        category: string;
        total: number;
    }[]>;
    employeeSales(query: {
        period?: 'daily' | 'weekly' | 'monthly';
        from?: string;
        to?: string;
    }): Promise<{
        user: string;
        total: number;
    }[]>;
    stockValuation(): Promise<{
        totalCost: number;
        totalRetail: number;
    }>;
    billPaymentReport(query: {
        provider?: string;
        from?: string;
        to?: string;
    }): Promise<{
        createdAt: Date;
        id: number;
        storeId: number;
        userId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        provider: string;
        reference: string;
        status: string;
    }[]>;
    supplierSales(query: {
        from?: string;
        to?: string;
    }): Promise<{
        supplier: string;
        total: number;
    }[]>;
    cashierShifts(query: {
        from?: string;
        to?: string;
    }): Promise<({
        user: {
            createdAt: Date;
            id: number;
            email: string;
            passwordHash: string;
            fullName: string;
            roleId: number;
            updatedAt: Date;
        };
        store: {
            id: number;
            name: string;
            code: string;
            address: string | null;
        };
    } & {
        id: number;
        storeId: number;
        userId: number;
        openedAt: Date;
        closedAt: Date | null;
        openingFloat: import("@prisma/client/runtime/library").Decimal;
        closingCash: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    cashFlow(query: {
        from?: string;
        to?: string;
    }): Promise<{
        byMethod: Record<string, number>;
        billsOut: number;
        netCash: number;
    }>;
    taxReport(query: {
        from?: string;
        to?: string;
        taxRate?: string;
    }): Promise<{
        total: number;
        taxRate: number;
        tax: number;
        net: number;
    }>;
}
