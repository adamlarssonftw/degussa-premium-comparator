export interface IItem {
    id?: string;
    name?: string;
    buy?: string;
    sell?: string;
    buy_currency?: string;
    sell_currency?: string;
    spread_percent?: number;
}

export interface ISpotResponseRaw {
    au_gold_eur: string;
    au_silber_eur: string;
    au_platin_eur: string;
    au_palladium_eur: string;
}
