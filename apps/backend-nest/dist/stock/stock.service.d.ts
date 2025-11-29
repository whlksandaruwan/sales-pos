import { PrismaService } from '../prisma/prisma.service';
export declare class StockService {
    private prisma;
    constructor(prisma: PrismaService);
    getByProduct(productId: number): Promise<({
        store: {
            id: number;
            name: string;
            code: string;
            address: string | null;
        };
    } & {
        id: number;
        storeId: number;
        productId: number;
        quantity: number;
    })[]>;
    adjust(productId: number, storeId: number, quantity: number, userId: number): Promise<{
        id: number;
        storeId: number;
        productId: number;
        quantity: number;
    }>;
    set(productId: number, storeId: number, quantity: number, userId: number): Promise<{
        id: number;
        storeId: number;
        productId: number;
        quantity: number;
    }>;
}
