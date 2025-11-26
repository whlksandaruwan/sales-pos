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
exports.BillPaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BillPaymentsService = class BillPaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async fetch(dto) {
        return {
            provider: dto.provider,
            reference: dto.reference,
            amount: 100.0,
            currency: 'USD',
            status: 'PENDING',
        };
    }
    async pay(userId, storeId, dto, idempotencyKey) {
        if (idempotencyKey) {
            const existing = await this.prisma.billPayment.findFirst({
                where: { provider: dto.provider, reference: dto.reference },
            });
            if (existing)
                return existing;
        }
        const record = await this.prisma.billPayment.create({
            data: {
                provider: dto.provider,
                reference: dto.reference,
                amount: dto.amount,
                status: 'PAID',
                userId,
                storeId,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: userId,
                action: 'BILL_PAID',
                entity: 'BillPayment',
                entityId: record.id,
                data: dto,
            },
        });
        return record;
    }
};
exports.BillPaymentsService = BillPaymentsService;
exports.BillPaymentsService = BillPaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BillPaymentsService);
//# sourceMappingURL=bill-payments.service.js.map