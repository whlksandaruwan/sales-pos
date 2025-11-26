import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        id: number;
        email: string;
        passwordHash: string;
        fullName: string;
        roleId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        role: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        email: string;
        passwordHash: string;
        fullName: string;
        roleId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
