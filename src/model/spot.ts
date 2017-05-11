import { Utils } from "../utils/index";
import { Calculator } from "../calculator-service";

export class Spot {
    public metal: string;
    public currency: string;
    private _gramPrice: number;

    public constructor(targetProperty: string) {
        let [au, metal, currency] = targetProperty.split("_");

        this.metal = metal;
        this.currency = currency;
    }

    public get gramPrice() {
        return this._gramPrice;
    }

    public setGramPriceFromTroyOz(ozPrice: string) {
        let ozPriceFormatted = parseFloat(Utils.formatCurrencyToDecimal(ozPrice));
        this._gramPrice = Calculator.troyOzToGram(ozPriceFormatted);
    }
}