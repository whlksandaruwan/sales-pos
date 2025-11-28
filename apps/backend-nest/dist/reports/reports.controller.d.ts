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
            id: number;
            createdAt: Date;
            email: string;
            passwordHash: string;
            fullName: string;
            roleId: number;
            updatedAt: Date;
        };
        items: {
            price: import("@prisma/client/runtime/library").Decimal;
            id: number;
            productId: number;
            quantity: number;
            discount: import("@prisma/client/runtime/library").Decimal;
            saleId: number;
            subtotal: import("@prisma/client/runtime/library").Decimal;
        }[];
        customer: {
            name: string;
            id: number;
            email: string | null;
            phone: string | null;
            credit: import("@prisma/client/runtime/library").Decimal;
        } | null;
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
        id: number;
        storeId: number;
        provider: string;
        reference: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: string;
        userId: number;
        createdAt: Date;
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
        store: {
            name: string;
            id: number;
            code: string;
            address: string | null;
        };
        user: {
            id: number;
            createdAt: Date;
            email: string;
            passwordHash: string;
            fullName: string;
            roleId: number;
            updatedAt: Date;
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
