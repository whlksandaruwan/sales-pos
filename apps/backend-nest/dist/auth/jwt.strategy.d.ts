import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: number;
        email: string;
    }): Promise<({
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
    }) | null>;
}
export {};
