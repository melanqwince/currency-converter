import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConversionRates } from '@app/shared/interfaces/conversion-rates.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private conversionRates: ConversionRates | null = null;

  //price in UAH
  public pricesToUAH = new BehaviorSubject<{ usd: number, eur: number } | null>(null);
  
  public readonly defaultCurrencies = [
    'USD', 'EUR', 'UAH', 'GBP', 'PLN'
  ];

  constructor(private http: HttpClient) { }

  public loadInitData(currency: string = 'USD'): Observable<ConversionRates> {
    return this.http.get<{ conversion_rates: ConversionRates }>(environment.API + environment.API_KEY + '/latest/' + currency)
      .pipe(
        map(response => response.conversion_rates)
      );
  }

  public setConversionRates(rates: ConversionRates) {
    this.conversionRates = rates;
  }

  public getConversionRates() {
    return this.conversionRates;
  }

  public convertCurrency(amount: number, fromCurrency: string, toCurrency: string, rates: ConversionRates) {
    // Ensure the currencies are in uppercase
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();
    
    // Check if the conversion rates exist for the given currencies
    if (rates[fromCurrency] && rates[toCurrency]) {
      // Convert the amount from the base currency (USD) to the target currency
      const convertedAmount = amount * (rates[toCurrency] / rates[fromCurrency]);
      return Number(convertedAmount.toFixed(4));
    } else {
      throw new Error('Currency not found in the conversion rates');
    }
  }
  
}
