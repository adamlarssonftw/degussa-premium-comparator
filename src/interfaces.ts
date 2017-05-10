export interface IItem {
    id?: string;
    name?: string;
    buy?: string;
    sell?: string;
    buy_currency?: string;
    sell_currency?: string;
    spread_percent?: number;
}

export interface ISpot {
    metal?: string;
    oz?: string;
    kg?: string;
    gram?: string;
    currency?: string;
}