import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: number;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__CategoryClient<({
        products: {
            name: string;
            sku: string;
            isbn: string | null;
            barcode: string;
            price: import("@prisma/client/runtime/library").Decimal;
            cost: import("@prisma/client/runtime/library").Decimal;
            unit: string;
            reorderThreshold: number;
            id: number;
            categoryId: number | null;
            supplierId: number | null;
        }[];
    } & {
        name: string;
        id: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create(name: string): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, name: string): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
}
