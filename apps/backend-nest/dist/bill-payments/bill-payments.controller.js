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
exports.BillPaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bill_payments_service_1 = require("./bill-payments.service");
const fetch_bill_dto_1 = require("./dto/fetch-bill.dto");
const pay_bill_dto_1 = require("./dto/pay-bill.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
let BillPaymentsController = class BillPaymentsController {
    constructor(service) {
        this.service = service;
    }
    async fetch(dto) {
        return this.service.fetch(dto);
    }
    async pay(req, idempotencyKey, dto) {
        const user = req.user;
        const storeId = 1;
        return this.service.pay(user.id, storeId, dto, idempotencyKey);
    }
};
exports.BillPaymentsController = BillPaymentsController;
__decorate([
    (0, common_1.Post)('fetch'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager, roles_enum_1.RoleEnum.Cashier),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fetch_bill_dto_1.FetchBillDto]),
    __metadata("design:returntype", Promise)
], BillPaymentsController.prototype, "fetch", null);
__decorate([
    (0, common_1.Post)('pay'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager, roles_enum_1.RoleEnum.Cashier),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('idempotency-key')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, pay_bill_dto_1.PayBillDto]),
    __metadata("design:returntype", Promise)
], BillPaymentsController.prototype, "pay", null);
exports.BillPaymentsController = BillPaymentsController = __decorate([
    (0, swagger_1.ApiTags)('BillPayments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('bill-payments'),
    __metadata("design:paramtypes", [bill_payments_service_1.BillPaymentsService])
], BillPaymentsController);
//# sourceMappingURL=bill-payments.controller.js.map