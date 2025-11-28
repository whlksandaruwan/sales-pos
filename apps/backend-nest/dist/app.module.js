"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const products_module_1 = require("./products/products.module");
const sales_module_1 = require("./sales/sales.module");
const bill_payments_module_1 = require("./bill-payments/bill-payments.module");
const reports_module_1 = require("./reports/reports.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const prisma_module_1 = require("./prisma/prisma.module");
const stores_module_1 = require("./stores/stores.module");
const customers_module_1 = require("./customers/customers.module");
const categories_module_1 = require("./categories/categories.module");
const stock_module_1 = require("./stock/stock.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: (Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
                    limit: Number(process.env.RATE_LIMIT_MAX) || 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            sales_module_1.SalesModule,
            bill_payments_module_1.BillPaymentsModule,
            reports_module_1.ReportsModule,
            dashboard_module_1.DashboardModule,
            stores_module_1.StoresModule,
            customers_module_1.CustomersModule,
            categories_module_1.CategoriesModule,
            stock_module_1.StockModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map