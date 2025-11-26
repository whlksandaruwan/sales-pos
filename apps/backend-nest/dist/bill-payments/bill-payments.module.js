"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillPaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const bill_payments_service_1 = require("./bill-payments.service");
const bill_payments_controller_1 = require("./bill-payments.controller");
let BillPaymentsModule = class BillPaymentsModule {
};
exports.BillPaymentsModule = BillPaymentsModule;
exports.BillPaymentsModule = BillPaymentsModule = __decorate([
    (0, common_1.Module)({
        controllers: [bill_payments_controller_1.BillPaymentsController],
        providers: [bill_payments_service_1.BillPaymentsService],
    })
], BillPaymentsModule);
//# sourceMappingURL=bill-payments.module.js.map