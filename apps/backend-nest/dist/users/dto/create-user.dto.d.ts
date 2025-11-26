import { RoleEnum } from '../../auth/roles.enum';
export declare class CreateUserDto {
    email: string;
    fullName: string;
    password: string;
    role: RoleEnum;
}
