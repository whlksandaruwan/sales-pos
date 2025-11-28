export declare class SaleItemDto {
    productId: number;
    quantity: number;
    price: number;
    discount?: number;
}
export declare enum PaymentMethod {
    Cash = "Cash",
    Card = "Card",
    QR = "QR",
    DigitalWallet = "DigitalWallet",
    Credit = "Credit"
}
export declare class PaymentDto {
    method: PaymentMethod;
    amount: number;
}
export declare class CreateSaleDto {
    items: SaleItemDto[];
    discount?: number;
    payments: PaymentDto[];
    customerId?: number;
    terminalIdentifier?: string;
}
