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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const create_sale_dto_1 = require("./dto/create-sale.dto");
let SalesService = class SalesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, storeId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const gross = dto.items.reduce((sum, item) => sum +
                (item.price - (item.discount || 0)) * item.quantity, 0);
            const discount = dto.discount || 0;
            if (discount < 0 || discount > gross) {
                throw new common_1.BadRequestException('Invalid discount amount');
            }
            const total = gross - discount;
            const sale = await tx.sale.create({
                data: {
                    storeId,
                    userId,
                    customerId: dto.customerId,
                    total,
                    discount,
                },
            });
            for (const item of dto.items) {
                const subtotal = (item.price - (item.discount || 0)) * item.quantity;
                await tx.saleItem.create({
                    data: {
                        saleId: sale.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        discount: item.discount || 0,
                        subtotal,
                    },
                });
                await tx.stock.updateMany({
                    where: { productId: item.productId, storeId },
                    data: { quantity: { decrement: item.quantity } },
                });
            }
            for (const payment of dto.payments) {
                await tx.payment.create({
                    data: {
                        saleId: sale.id,
                        method: payment.method,
                        amount: payment.amount,
                    },
                });
            }
            const creditPayment = dto.payments.find((p) => p.method === create_sale_dto_1.PaymentMethod.Credit);
            if (creditPayment && dto.customerId) {
                await tx.customer.update({
                    where: { id: dto.customerId },
                    data: {
                        credit: {
                            increment: creditPayment.amount,
                        },
                    },
                });
            }
            await tx.auditLog.create({
                data: {
                    actorId: userId,
                    action: 'SALE_CREATED',
                    entity: 'Sale',
                    entityId: sale.id,
                    data: dto,
                },
            });
            return sale;
        });
    }
    async findOne(id) {
        return this.prisma.sale.findUnique({
            where: { id },
            include: { items: true, payments: true },
        });
    }
    async refund(originalSaleId, userId, storeId, items) {
        return this.prisma.$transaction(async (tx) => {
            const original = await tx.sale.findUnique({
                where: { id: originalSaleId },
                include: { items: true },
            });
            if (!original) {
                throw new Error('Original sale not found');
            }
            let totalRefund = 0;
            const refundSale = await tx.sale.create({
                data: {
                    storeId,
                    userId,
                    customerId: original.customerId,
                    total: 0,
                    discount: 0,
                },
            });
            for (const reqItem of items) {
                const soldItem = original.items.find((i) => i.productId === reqItem.productId);
                if (!soldItem)
                    continue;
                const qty = Math.min(reqItem.quantity, soldItem.quantity);
                if (qty <= 0)
                    continue;
                const unitNet = Number(soldItem.price) - Number(soldItem.discount || 0);
                const subtotal = unitNet * qty * -1;
                totalRefund += subtotal;
                await tx.saleItem.create({
                    data: {
                        saleId: refundSale.id,
                        productId: soldItem.productId,
                        quantity: qty * -1,
                        price: soldItem.price,
                        discount: soldItem.discount,
                        subtotal,
                    },
                });
                await tx.stock.updateMany({
                    where: { productId: soldItem.productId, storeId },
                    data: { quantity: { increment: qty } },
                });
            }
            await tx.sale.update({
                where: { id: refundSale.id },
                data: { total: totalRefund },
            });
            await tx.auditLog.create({
                data: {
                    actorId: userId,
                    action: 'SALE_REFUNDED',
                    entity: 'Sale',
                    entityId: refundSale.id,
                    data: { originalSaleId, items },
                },
            });
            return refundSale;
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalesService);
//# sourceMappingURL=sales.service.js.map