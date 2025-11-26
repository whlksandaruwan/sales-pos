import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleEnum } from '../auth/roles.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const role = await this.prisma.role.findFirst({
      where: { name: dto.role },
    });
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
        roleId: role?.id ?? 1,
      },
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany({ include: { role: true } });
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role?.name || 'Unknown',
    }));
  }
}


