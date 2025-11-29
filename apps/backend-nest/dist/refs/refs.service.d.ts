import { PrismaService } from '../prisma/prisma.service';
import { CreateRefDto } from './dto/create-ref.dto';
import { CreateRefDeliveryDto } from './dto/create-ref-delivery.dto';
export declare class RefsService {
    private prisma;
    constructor(prisma: PrismaService);
    createRef(dto: CreateRefDto): import(".prisma/client").Prisma.Prisma__RefClient<{
        createdAt: Date;
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        companyName: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listRefs(): import(".prisma/client").Prisma.PrismaPromise<{
        createdAt: Date;
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        companyName: string;
    }[]>;
    addDelivery(refId: number, dto: CreateRefDeliveryDto): Promise<{
        createdAt: Date;
        id: number;
        companyName: string;
        billNumber: string | null;
        billDate: Date | null;
        billImageUrl: string | null;
        notes: string | null;
        refId: number;
    }>;
    listDeliveriesForRef(refId: number): import(".prisma/client").Prisma.PrismaPromise<{
        createdAt: Date;
        id: number;
        companyName: string;
        billNumber: string | null;
        billDate: Date | null;
        billImageUrl: string | null;
        notes: string | null;
        refId: number;
    }[]>;
    listAllDeliveries(): import(".prisma/client").Prisma.PrismaPromise<({
        ref: {
            createdAt: Date;
            id: number;
            name: string;
            email: string | null;
            phone: string | null;
            companyName: string;
        };
    } & {
        createdAt: Date;
        id: number;
        companyName: string;
        billNumber: string | null;
        billDate: Date | null;
        billImageUrl: string | null;
        notes: string | null;
        refId: number;
    })[]>;
}
