import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
