import { PrismaService } from '../prisma/prisma.service';
import { FetchBillDto } from './dto/fetch-bill.dto';
import { PayBillDto } from './dto/pay-bill.dto';
export declare class BillPaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    fetch(dto: FetchBillDto): Promise<{
        provider: import("./dto/fetch-bill.dto").BillProvider;
        reference: string;
        amount: number;
        currency: string;
        status: string;
    }>;
    pay(userId: number, storeId: number, dto: PayBillDto, idempotencyKey?: string): Promise<{
        id: number;
        storeId: number;
        provider: string;
        reference: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: string;
        userId: number;
        createdAt: Date;
    }>;
}
