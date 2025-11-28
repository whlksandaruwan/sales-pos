import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
