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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateBarcode() {
        return `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    }
    async create(dto) {
        const barcode = dto.barcode || this.generateBarcode();
        return this.prisma.product.create({
            data: {
                name: dto.name,
                sku: dto.sku,
                isbn: dto.isbn,
                barcode,
                categoryId: dto.categoryId,
                price: dto.price,
                cost: dto.cost,
                unit: dto.unit,
                reorderThreshold: dto.reorderThreshold,
            },
        });
    }
    async update(id, dto) {
        const existing = await this.prisma.product.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Product not found');
        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }
    async delete(id) {
        await this.prisma.product.delete({ where: { id } });
        return { success: true };
    }
    async findByBarcode(code) {
        const product = await this.prisma.product.findFirst({
            where: { barcode: code },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map