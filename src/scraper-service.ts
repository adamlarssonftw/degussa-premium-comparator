import { Observable, Observer } from "rxjs";
import { RxHttpRequest } from "rx-http-request";
import { IItem, ISpotResponseRaw } from "./interfaces";
import { Spot } from "./model/spot";
import { Utils } from "./utils/index";

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

  public getSpotPrices(spotObj: ISpotResponseRaw, targetProperties: string[]) {
    let spots = {};

    targetProperties.forEach((property) => {
      let spot = new Spot(property);
      let [ozPrice] = spotObj[property].split(" ");
      spot.setGramPriceFromTroyOz(ozPrice);
      spots[spot.metal] = spot;
    });

    return spots;
  }

  public getItemsForSale(tableId: string): IItem[] {
    let table = this.$(tableId);
    let tableRows = table.find("tbody").children("tr").toArray();

    let itemArr = [];

    let counter = 0;
    for (let row of tableRows) {

      if (counter === 0) {
        console.log('row', row.children[0]);
        counter++;
      }

      //Todo: kom pa nat bra satt att fixa denna rora.
      let [sell, s_currency] = row.children[3].children[0].data.split(" ");
      let [buy, b_currency] = row.children[4].children[0].data.split(" ");

      let res: IItem = {
        id: row.children[0].children[0].data,
        name: row.children[2].children[0].data,
        sell: Utils.formatCurrencyToDecimal(sell),
        buy: Utils.formatCurrencyToDecimal(buy),
        sell_currency: s_currency,
        buy_currency: b_currency,
      };

      itemArr.push(res);
    }
    return itemArr;
  }
}
