import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            products: number;
        };
    } & {
        id: number;
        name: string;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__CategoryClient<({
        products: {
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
        }[];
    } & {
        id: number;
        name: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create(name: string): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, name: string): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
}
