import { BillPaymentsService } from './bill-payments.service';
import { FetchBillDto } from './dto/fetch-bill.dto';
import { PayBillDto } from './dto/pay-bill.dto';
export declare class BillPaymentsController {
    private service;
    constructor(service: BillPaymentsService);
    fetch(dto: FetchBillDto): Promise<{
        provider: import("./dto/fetch-bill.dto").BillProvider;
        reference: string;
        amount: number;
        currency: string;
        status: string;
    }>;
    pay(req: any, idempotencyKey: string | undefined, dto: PayBillDto): Promise<{
        id: number;
        createdAt: Date;
        provider: string;
        reference: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: string;
        userId: number;
        storeId: number;
    }>;
}
