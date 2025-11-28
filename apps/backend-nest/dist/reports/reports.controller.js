"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
let ReportsController = class ReportsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getDateRange(query) {
        const now = new Date();
        let start;
        let end;
        if (query?.from || query?.to) {
            start = query.from ? new Date(query.from) : new Date(0);
            start.setHours(0, 0, 0, 0);
            end = query.to ? new Date(query.to) : now;
            end.setHours(23, 59, 59, 999);
        }
        else {
            const period = query?.period ?? 'daily';
            end = now;
            start = new Date(now);
            if (period === 'daily')
                start.setDate(now.getDate() - 1);
            else if (period === 'weekly')
                start.setDate(now.getDate() - 7);
            else
                start.setMonth(now.getMonth() - 1);
        }
        return { start, end };
    }
    async sales(query) {
        const { start, end } = this.getDateRange(query);
        const sales = await this.prisma.sale.findMany({
            where: { createdAt: { gte: start, lte: end } },
            include: { items: true, payments: true, user: true, customer: true },
            orderBy: { createdAt: 'desc' },
        });
        return sales;
    }
    async pnl(query) {
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
    async categorySales(query) {
        const { start, end } = this.getDateRange(query);
        const items = await this.prisma.saleItem.findMany({
            where: {
                sale: { createdAt: { gte: start, lte: end } },
            },
            include: { product: { include: { category: true } } },
        });
        const byCategory = {};
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
    async employeeSales(query) {
        const { start, end } = this.getDateRange(query);
        const sales = await this.prisma.sale.findMany({
            where: { createdAt: { gte: start, lte: end } },
            include: { user: true },
        });
        const byUser = {};
        for (const sale of sales) {
            const name = sale.user.fullName;
            byUser[name] = (byUser[name] || 0) + Number(sale.total);
        }
        return Object.entries(byUser).map(([user, total]) => ({
            user,
            total,
        }));
    }
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
    async billPaymentReport(query) {
        const { start, end } = this.getDateRange(query);
        return this.prisma.billPayment.findMany({
            where: {
                createdAt: { gte: start, lte: end },
                ...(query.provider ? { provider: query.provider } : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async supplierSales(query) {
        const { start, end } = this.getDateRange(query);
        const items = await this.prisma.saleItem.findMany({
            where: {
                sale: { createdAt: { gte: start, lte: end } },
            },
            include: { product: { include: { supplier: true } } },
        });
        const bySupplier = {};
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
    async cashierShifts(query) {
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
    async cashFlow(query) {
        const { start, end } = this.getDateRange(query);
        const payments = await this.prisma.payment.findMany({
            where: {
                sale: { createdAt: { gte: start, lte: end } },
            },
        });
        const billPayments = await this.prisma.billPayment.findMany({
            where: { createdAt: { gte: start, lte: end } },
        });
        const byMethod = {};
        for (const p of payments) {
            byMethod[p.method] = (byMethod[p.method] || 0) + Number(p.amount);
        }
        const billsOut = billPayments.reduce((sum, b) => sum + Number(b.amount), 0);
        const totalIn = Object.values(byMethod).reduce((sum, v) => sum + v, 0);
        const netCash = totalIn - billsOut;
        return { byMethod, billsOut, netCash };
    }
    async taxReport(query) {
        const { start, end } = this.getDateRange(query);
        const taxRateNum = Number(query.taxRate ?? '15');
        const sales = await this.prisma.sale.findMany({
            where: { createdAt: { gte: start, lte: end } },
        });
        const total = sales.reduce((sum, s) => sum + Number(s.total), 0);
        const tax = (total * taxRateNum) / 100;
        const net = total - tax;
        return {
            total,
            taxRate: taxRateNum,
            tax,
            net,
        };
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('sales'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "sales", null);
__decorate([
    (0, common_1.Get)('pnl'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "pnl", null);
__decorate([
    (0, common_1.Get)('category-sales'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "categorySales", null);
__decorate([
    (0, common_1.Get)('employee-sales'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "employeeSales", null);
__decorate([
    (0, common_1.Get)('stock-valuation'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "stockValuation", null);
__decorate([
    (0, common_1.Get)('bill-payments'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "billPaymentReport", null);
__decorate([
    (0, common_1.Get)('supplier-sales'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "supplierSales", null);
__decorate([
    (0, common_1.Get)('cashier-shifts'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "cashierShifts", null);
__decorate([
    (0, common_1.Get)('cash-flow'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "cashFlow", null);
__decorate([
    (0, common_1.Get)('tax'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "taxReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map