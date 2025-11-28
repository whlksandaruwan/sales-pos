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

  /** Helper: compute date range either from from/to or from period */
  private getDateRange(query?: {
    period?: 'daily' | 'weekly' | 'monthly';
    from?: string;
    to?: string;
  }) {
    const now = new Date();
    let start: Date;
    let end: Date;

    if (query?.from || query?.to) {
      start = query.from ? new Date(query.from) : new Date(0);
      start.setHours(0, 0, 0, 0);
      end = query.to ? new Date(query.to) : now;
      end.setHours(23, 59, 59, 999);
    } else {
      const period = query?.period ?? 'daily';
      end = now;
      start = new Date(now);
      if (period === 'daily') start.setDate(now.getDate() - 1);
      else if (period === 'weekly') start.setDate(now.getDate() - 7);
      else start.setMonth(now.getMonth() - 1);
    }

    return { start, end };
  }

  @Get('sales')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async sales(
    @Query()
    query: {
      period?: 'daily' | 'weekly' | 'monthly';
      from?: string;
      to?: string;
    },
  ) {
    const { start, end } = this.getDateRange(query);
    const sales = await this.prisma.sale.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { items: true, payments: true, user: true, customer: true },
      orderBy: { createdAt: 'desc' },
    });
    return sales;
  }

  @Get('pnl')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async pnl(
    @Query()
    query: {
      period?: 'daily' | 'weekly' | 'monthly';
      from?: string;
      to?: string;
    },
  ) {
    const { start, end } = this.getDateRange(query);
    const sales = await this.prisma.sale.findMany({
      where: { createdAt: { gte: start, lte: end } },
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
    @Query()
    query: {
      period?: 'daily' | 'weekly' | 'monthly';
      from?: string;
      to?: string;
    },
  ) {
    const { start, end } = this.getDateRange(query);
    const items = await this.prisma.saleItem.findMany({
      where: {
        sale: { createdAt: { gte: start, lte: end } },
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
    @Query()
    query: {
      period?: 'daily' | 'weekly' | 'monthly';
      from?: string;
      to?: string;
    },
  ) {
    const { start, end } = this.getDateRange(query);
    const sales = await this.prisma.sale.findMany({
      where: { createdAt: { gte: start, lte: end } },
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
    @Query()
    query: {
      provider?: string;
      from?: string;
      to?: string;
    },
  ) {
    const { start, end } = this.getDateRange(query);
    return this.prisma.billPayment.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        ...(query.provider ? { provider: query.provider } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('supplier-sales')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async supplierSales(
    @Query()
    query: {
      from?: string;
      to?: string;
    },
  ) {
    const { start, end } = this.getDateRange(query);
    const items = await this.prisma.saleItem.findMany({
      where: {
        sale: { createdAt: { gte: start, lte: end } },
      },
      include: { product: { include: { supplier: true } } },
    });

    const bySupplier: Record<string, number> = {};
    for (const item of items) {
      const supplierName = item.product.supplier?.name || 'No Supplier';
      bySupplier[supplierName] =
        (bySupplier[supplierName] || 0) + Number(item.subtotal);
    }

    return Object.entries(bySupplier).map(([supplier, total]) => ({
      supplier,
      total,
    }));
  }

  @Get('cashier-shifts')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async cashierShifts(
    @Query()
    query: {
      from?: string;
      to?: string;
    },
  ) {
    const { start, end } = this.getDateRange(query);
    const shifts = await this.prisma.cashierShift.findMany({
      where: {
        openedAt: { gte: start, lte: end },
      },
      include: { user: true, store: true },
      orderBy: { openedAt: 'desc' },
    });

    return shifts;
  }

  @Get('cash-flow')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async cashFlow(
    @Query()
    query: {
      from?: string;
      to?: string;
    },
  ) {
    const { start, end } = this.getDateRange(query);

    const payments = await this.prisma.payment.findMany({
      where: {
        sale: { createdAt: { gte: start, lte: end } },
      },
    });

    const billPayments = await this.prisma.billPayment.findMany({
      where: { createdAt: { gte: start, lte: end } },
    });

    const byMethod: Record<string, number> = {};
    for (const p of payments) {
      byMethod[p.method] = (byMethod[p.method] || 0) + Number(p.amount);
    }

    const billsOut = billPayments.reduce(
      (sum, b) => sum + Number(b.amount),
      0,
    );

    const totalIn = Object.values(byMethod).reduce(
      (sum, v) => sum + v,
      0,
    );

    const netCash = totalIn - billsOut;

    return { byMethod, billsOut, netCash };
  }

  @Get('tax')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async taxReport(
    @Query()
    query: {
      from?: string;
      to?: string;
      taxRate?: string;
    },
  ) {
    const { start, end } = this.getDateRange(query);
    const taxRateNum = Number(query.taxRate ?? '15'); // default 15%

    const sales = await this.prisma.sale.findMany({
      where: { createdAt: { gte: start, lte: end } },
    });

    const total = sales.reduce(
      (sum, s) => sum + Number(s.total),
      0,
    );

    const tax = (total * taxRateNum) / 100;
    const net = total - tax;

    return {
      total,
      taxRate: taxRateNum,
      tax,
      net,
    };
  }
}


