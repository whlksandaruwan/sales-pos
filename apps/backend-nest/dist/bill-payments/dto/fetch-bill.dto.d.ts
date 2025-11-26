export declare enum BillProvider {
    Electricity = "electricity",
    Water = "water",
    Mobile = "mobile"
}
export declare class FetchBillDto {
    provider: BillProvider;
    reference: string;
}
