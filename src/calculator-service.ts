import { IItem } from "./interfaces";

export class Calculator {

  public static sortBySpread(items: IItem[]): IItem[] {
    return items.sort((itemA, itemB) => {
      return Calculator.calculateSpread(itemA) - Calculator.calculateSpread(itemB);
    });
  }

  private static calculateSpread(item: IItem): number {
    let diff = parseFloat(item.buy) - parseFloat(item.sell);
    item.spread_percent = Math.round((diff / parseFloat(item.buy)) * 100);
    return item.spread_percent;
  }

  public static troyOzToGram(oz: number) {
    return oz / 31.1034768;
  }
}
