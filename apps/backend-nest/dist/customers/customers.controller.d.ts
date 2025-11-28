import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersController {
    private customersService;
    constructor(customersService: CustomersService);
    create(dto: CreateCustomerDto): import(".prisma/client").Prisma.Prisma__CustomerClient<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        credit: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        credit: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__CustomerClient<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        credit: import("@prisma/client/runtime/library").Decimal;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateCustomerDto): import(".prisma/client").Prisma.Prisma__CustomerClient<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        credit: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    settleCredit(id: string, amount: string): Promise<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        credit: import("@prisma/client/runtime/library").Decimal;
    }>;
    salesHistory(id: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
}
