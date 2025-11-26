export declare class CreateProductDto {
    name: string;
    sku: string;
    isbn?: string;
    barcode?: string;
    categoryId?: number;
    price: number;
    cost: number;
    unit: string;
    reorderThreshold: number;
}
