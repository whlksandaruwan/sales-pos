import { PrismaService } from '../prisma/prisma.service';
export declare class StockService {
    private prisma;
    constructor(prisma: PrismaService);
    getByProduct(productId: number): Promise<({
        store: {
            name: string;
            id: number;
            code: string;
            address: string | null;
        };
    } & {
        id: number;
        productId: number;
        storeId: number;
        quantity: number;
    })[]>;
    adjust(productId: number, storeId: number, quantity: number, userId: number): Promise<{
        id: number;
        productId: number;
        storeId: number;
        quantity: number;
    }>;
    set(productId: number, storeId: number, quantity: number, userId: number): Promise<{
        id: number;
        productId: number;
        storeId: number;
        quantity: number;
    }>;
}
