import { ConversionRates } from "./conversion-rates.interface";

export interface ConvertCurrencyParams {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    rates: ConversionRates;
}