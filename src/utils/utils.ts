export class Utils {
    public static generateTimestamp() {
        return new Date().getTime();
    }

    public static formatCurrencyToDecimal(s: string): string {
        return s.replace(".", "").replace(",", ".");
    }
}
