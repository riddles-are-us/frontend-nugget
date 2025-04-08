export interface Bid {
    bidprice: number;
}

export interface NuggetData {
    id: number;
    attributes: string;
    feature: number;
    cycle: number;
    sysprice: number;
    askprice: number;
    bid: Bid | null;
}