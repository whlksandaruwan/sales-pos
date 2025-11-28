import { StockService } from './stock.service';
export declare class StockController {
    private service;
    constructor(service: StockService);
    getByProduct(productId: string): Promise<({
        store: {
            name: string;
            id: number;
            code: string;
            address: string | null;
        };
    } & {
        id: number;
        productId: number;
        storeId: number;
        quantity: number;
    })[]>;
    adjust(req: any, body: {
        productId: number;
        storeId: number;
        quantity: number;
    }): Promise<{
        id: number;
        productId: number;
        storeId: number;
        quantity: number;
    }>;
    set(req: any, body: {
        productId: number;
        storeId: number;
        quantity: number;
    }): Promise<{
        id: number;
        productId: number;
        storeId: number;
        quantity: number;
    }>;
}
