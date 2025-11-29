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
exports.RefsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RefsService = class RefsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createRef(dto) {
        return this.prisma.ref.create({ data: dto });
    }
    listRefs() {
        return this.prisma.ref.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async addDelivery(refId, dto) {
        const { companyName, billNumber, billDate, billImageUrl, notes } = dto;
        return this.prisma.refDelivery.create({
            data: {
                refId,
                companyName,
                billNumber,
                billImageUrl,
                notes,
                billDate: billDate ? new Date(billDate) : undefined,
            },
        });
    }
    listDeliveriesForRef(refId) {
        return this.prisma.refDelivery.findMany({
            where: { refId },
            orderBy: { createdAt: 'desc' },
        });
    }
    listAllDeliveries() {
        return this.prisma.refDelivery.findMany({
            include: {
                ref: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.RefsService = RefsService;
exports.RefsService = RefsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RefsService);
//# sourceMappingURL=refs.service.js.map