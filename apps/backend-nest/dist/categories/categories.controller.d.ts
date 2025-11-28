import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private service;
    constructor(service: CategoriesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: number;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__CategoryClient<({
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
    create(body: {
        name: string;
    }): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, body: {
        name: string;
    }): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
