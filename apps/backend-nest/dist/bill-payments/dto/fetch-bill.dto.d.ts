export declare enum BillProvider {
    Electricity = "electricity",
    Water = "water"
}
export declare class FetchBillDto {
    provider: BillProvider;
    reference: string;
}
