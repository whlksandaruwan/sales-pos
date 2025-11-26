import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../auth/roles.enum';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  @Get('sales')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async sales(@Query('period') period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const now = new Date();
    const start = new Date(now);
    if (period === 'daily') start.setDate(now.getDate() - 1);
    else if (period === 'weekly') start.setDate(now.getDate() - 7);
    else start.setMonth(now.getMonth() - 1);
    const sales = await this.prisma.sale.findMany({
      where: { createdAt: { gte: start, lte: now } },
      include: { items: true, payments: true },
    });
    return sales;
  }

  @Get('pnl')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async pnl() {
    const sales = await this.prisma.sale.findMany({
      include: { items: { include: { product: true } } },
    });
    let revenue = 0;
    let cost = 0;
    for (const sale of sales) {
      for (const item of sale.items) {
        revenue += Number(item.subtotal);
        cost += Number(item.product.cost) * item.quantity;
      }
    }
    return { revenue, cost, profit: revenue - cost };
  }

  @Get('category-sales')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async categorySales(
    @Query('period') period: 'daily' | 'weekly' | 'monthly' = 'daily',
  ) {
    const now = new Date();
    const start = new Date(now);
    if (period === 'daily') start.setDate(now.getDate() - 1);
    else if (period === 'weekly') start.setDate(now.getDate() - 7);
    else start.setMonth(now.getMonth() - 1);

    const items = await this.prisma.saleItem.findMany({
      where: {
        sale: { createdAt: { gte: start, lte: now } },
      },
      include: { product: { include: { category: true } } },
    });

    const byCategory: Record<string, number> = {};
    for (const item of items) {
      const categoryName = item.product.category?.name || 'Uncategorized';
      byCategory[categoryName] =
        (byCategory[categoryName] || 0) + Number(item.subtotal);
    }

    return Object.entries(byCategory).map(([category, total]) => ({
      category,
      total,
    }));
  }

  @Get('employee-sales')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async employeeSales(
    @Query('period') period: 'daily' | 'weekly' | 'monthly' = 'daily',
  ) {
    const now = new Date();
    const start = new Date(now);
    if (period === 'daily') start.setDate(now.getDate() - 1);
    else if (period === 'weekly') start.setDate(now.getDate() - 7);
    else start.setMonth(now.getMonth() - 1);

    const sales = await this.prisma.sale.findMany({
      where: { createdAt: { gte: start, lte: now } },
      include: { user: true },
    });

    const byUser: Record<string, number> = {};
    for (const sale of sales) {
      const name = sale.user.fullName;
      byUser[name] = (byUser[name] || 0) + Number(sale.total);
    }

    return Object.entries(byUser).map(([user, total]) => ({
      user,
      total,
    }));
  }

  @Get('stock-valuation')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async stockValuation() {
    const stocks = await this.prisma.stock.findMany({
      include: { product: true },
    });
    let totalCost = 0;
    let totalRetail = 0;
    for (const s of stocks) {
      totalCost += Number(s.product.cost) * s.quantity;
      totalRetail += Number(s.product.price) * s.quantity;
    }
    return { totalCost, totalRetail };
  }

  @Get('bill-payments')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async billPaymentReport(
    @Query('provider') provider?: string,
  ) {
    return this.prisma.billPayment.findMany({
      where: provider ? { provider } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }
}


