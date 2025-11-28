import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        id: number;
        createdAt: Date;
        email: string;
        passwordHash: string;
        fullName: string;
        roleId: number;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: number;
        email: string;
        fullName: string;
        role: string;
    }[]>;
}
