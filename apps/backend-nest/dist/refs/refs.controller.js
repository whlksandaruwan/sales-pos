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
exports.RefsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const refs_service_1 = require("./refs.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
const create_ref_dto_1 = require("./dto/create-ref.dto");
const create_ref_delivery_dto_1 = require("./dto/create-ref-delivery.dto");
let RefsController = class RefsController {
    constructor(refsService) {
        this.refsService = refsService;
    }
    createRef(dto) {
        return this.refsService.createRef(dto);
    }
    listRefs() {
        return this.refsService.listRefs();
    }
    addDelivery(id, dto) {
        return this.refsService.addDelivery(Number(id), dto);
    }
    listDeliveriesForRef(id) {
        return this.refsService.listDeliveriesForRef(Number(id));
    }
    listAllDeliveries() {
        return this.refsService.listAllDeliveries();
    }
};
exports.RefsController = RefsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ref_dto_1.CreateRefDto]),
    __metadata("design:returntype", void 0)
], RefsController.prototype, "createRef", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RefsController.prototype, "listRefs", null);
__decorate([
    (0, common_1.Post)(':id/deliveries'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_ref_delivery_dto_1.CreateRefDeliveryDto]),
    __metadata("design:returntype", void 0)
], RefsController.prototype, "addDelivery", null);
__decorate([
    (0, common_1.Get)(':id/deliveries'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RefsController.prototype, "listDeliveriesForRef", null);
__decorate([
    (0, common_1.Get)('deliveries/all'),
    (0, roles_decorator_1.Roles)(roles_enum_1.RoleEnum.Admin, roles_enum_1.RoleEnum.Manager),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RefsController.prototype, "listAllDeliveries", null);
exports.RefsController = RefsController = __decorate([
    (0, swagger_1.ApiTags)('Refs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('refs'),
    __metadata("design:paramtypes", [refs_service_1.RefsService])
], RefsController);
//# sourceMappingURL=refs.controller.js.map