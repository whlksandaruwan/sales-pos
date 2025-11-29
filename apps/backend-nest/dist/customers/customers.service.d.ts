import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCustomerDto): import(".prisma/client").Prisma.Prisma__CustomerClient<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        credit: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        credit: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        credit: import("@prisma/client/runtime/library").Decimal;
    } | null>;
    update(id: number, dto: UpdateCustomerDto): import(".prisma/client").Prisma.Prisma__CustomerClient<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        credit: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    settleCredit(id: number, amount: number): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        credit: import("@prisma/client/runtime/library").Decimal;
    }>;
    salesHistory(id: number): import(".prisma/client").Prisma.PrismaPromise<({
        items: ({
            product: {
                id: number;
                name: string;
                price: import("@prisma/client/runtime/library").Decimal;
                sku: string;
                isbn: string | null;
                barcode: string;
                cost: import("@prisma/client/runtime/library").Decimal;
                unit: string;
                reorderThreshold: number;
                categoryId: number | null;
                supplierId: number | null;
            };
        } & {
            discount: import("@prisma/client/runtime/library").Decimal;
            id: number;
            saleId: number;
            productId: number;
            quantity: number;
            price: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
        })[];
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
    productRefs(): Promise<({
        product: {
            id: number;
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
            sku: string;
            isbn: string | null;
            barcode: string;
            cost: import("@prisma/client/runtime/library").Decimal;
            unit: string;
            reorderThreshold: number;
            categoryId: number | null;
            supplierId: number | null;
        };
        sale: {
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
        };
    } & {
        discount: import("@prisma/client/runtime/library").Decimal;
        id: number;
        saleId: number;
        productId: number;
        quantity: number;
        price: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
    })[]>;
}
