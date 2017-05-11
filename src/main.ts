import { Observable, Observer } from "rxjs";
import { RxHttpRequest } from "rx-http-request";
import { Calculator } from "./calculator-service";
import { Scraper } from "./scraper-service";
import { IItem } from "./interfaces";
import { Utils } from "./utils/index";

class Main {
    private goldItems: IItem[];
    private silverItems: IItem[];
    private platinumItems: IItem[];
    private spotPrices: any;

    private spotPricesURL = "https://www.gold.de/ajax/data.php?";
    private priceDataSourceURL = "http://www.degussa-goldhandel.de/infothek/preisliste/";
    private propertiesOfInterest = ["au_gold_eur", "au_silber_eur", "au_platin_eur", "au_palladium_eur"];

    private scraper: Scraper;

    constructor() {
        this.scraper = new Scraper();
        this.getMetalShopPrices();
        this.getMetalSpotPrices();
    }

    public getMetalShopPrices() {
        this.scraper.attemptRequest(this.priceDataSourceURL).subscribe((html: string) => {
            this.scraper.loadCheerioWithHtml(html);
            this.goldItems = this.scraper.getItemsForSale("#tab2");
            this.silverItems = this.scraper.getItemsForSale("#tab3");
            this.platinumItems = this.scraper.getItemsForSale("#tab4");
        });
    }

    public getMetalSpotPrices() {
        let timestampedURL = `${this.spotPricesURL}func=json&_=${Utils.generateTimestamp()}`;
        this.scraper.attemptRequest(timestampedURL).subscribe((response: string) => {
            let responseObject = JSON.parse(response);
            this.spotPrices = this.scraper.getSpotPrices(responseObject, this.propertiesOfInterest);
        });
    }
}

let m = new Main();
