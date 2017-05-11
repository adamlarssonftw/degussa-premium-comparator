import { Observable, Observer } from "rxjs";
import { RxHttpRequest } from "rx-http-request";
import { IItem, ISpot, ISpotResponseRaw } from "./interfaces";
import { Calculator } from "./calculator-service";

let cheerio = require("cheerio");

export class Scraper {
  public $: any;

  public attemptRequest(url: string) {
    return Observable.create((o: Observer<string>) => {
      return RxHttpRequest.get(url).subscribe(
        (data) => {
          if (data.response.statusCode === 200) {
            o.next(data.body);
            o.complete();
          }
        },
        (err) => console.log(err)
      );
    });
  }

  public loadCheerioWithHtml(html: string) {
    this.$ = cheerio.load(html);
  };

  public makeSpot(targetProperty: string): ISpot {
    let [au, metal, currency] = targetProperty.split("_");

    return {
      metal: metal,
      currency: currency,
    };
  }

  public getSpotPrices(spotObj: ISpotResponseRaw, targetProperties: string[]) {
    let spots = {};

    targetProperties.forEach((property) => {
      let spot = this.makeSpot(property);
      let [ozPrice] = spotObj[property].split(" ");
      let ozPriceFormatted = parseFloat(this.formatCurrencyToDecimal(ozPrice));
      spot.gramPrice = Calculator.troyOzToGram(ozPriceFormatted);
      spots[spot.metal] = spot;
    });

    return spots;
  }

  public getItemsForSale(tableId: string): IItem[] {
    let table = this.$(tableId);
    let tableRows = table.find("tbody").children("tr").toArray();
    let itemArr = [];

    for (let row of tableRows) {
      let s = row.children[3].children[0].data.split(" ");
      let b = row.children[4].children[0].data.split(" ");

      let res: IItem = {
        id: row.children[0].children[0].data,
        name: row.children[2].children[0].data,
        sell: this.formatCurrencyToDecimal(s[0]),
        buy: this.formatCurrencyToDecimal(b[0]),
        sell_currency: s[1],
        buy_currency: b[1],
      };

      itemArr.push(res);
    }
    return itemArr;
  }

  private formatCurrencyToDecimal(s: string): string {
    return s.replace(".", "").replace(",", ".");
  }
}
