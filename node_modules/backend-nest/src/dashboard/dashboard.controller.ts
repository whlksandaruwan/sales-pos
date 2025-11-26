import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../auth/roles.enum';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('low-stock')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async lowStock() {
    const low = await this.prisma.product.findMany({
      where: {
        stock: {
          some: {
            quantity: { lt: 10 },
          },
        },
      },
      include: {
        stock: true,
      },
    });
    return low;
  }
}


