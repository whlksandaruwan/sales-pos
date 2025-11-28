import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        role: {
            id: number;
            name: string;
        };
    } & {
        email: string;
        passwordHash: string;
        fullName: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        roleId: number;
    }>;
    login(userId: number, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
