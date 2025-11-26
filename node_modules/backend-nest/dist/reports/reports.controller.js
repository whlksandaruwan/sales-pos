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
    async sales(period = 'daily') {
        const now = new Date();
        const start = new Date(now);
        if (period === 'daily')
            start.setDate(now.getDate() - 1);
        else if (period === 'weekly')
            start.setDate(now.getDate() - 7);
        else
            start.setMonth(now.getMonth() - 1);
        const sales = await this.prisma.sale.findMany({
            where: { createdAt: { gte: start, lte: now } },
            include: { items: true, payments: true },
        });
        return sales;
    }
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
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('sales'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "sales", null);
__decorate([
    (0, common_1.Get)('pnl'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "pnl", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map