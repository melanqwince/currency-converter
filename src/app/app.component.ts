import { Component } from '@angular/core';
import { HeaderComponent } from './partials/header/header.component';
import { ConverterComponent } from './shared/components/converter/converter.component';
import { DataService } from './shared/services/data.service';
import { ConversionRates } from './shared/interfaces/conversion-rates.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    ConverterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'currency-converter-test';

  baseUSDRates!: ConversionRates;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    const rates = this.dataService.getConversionRates();
    console.log(rates);
    //check if rates exist with standart currency - EUR
    if (rates && rates['EUR']) {
      this.baseUSDRates = rates;

      //save default prices for header in UAH
      const priceUSD: number = rates['UAH'];
      const priceEUR: number = this.dataService.convertCurrency(1, 'EUR', 'UAH', rates);
      this.dataService.pricesToUAH.next({ usd: Number(priceUSD.toFixed(2)), eur: Number(priceEUR.toFixed(2))});
    } else {
      console.error('Error', 'Conversion rates not found');
    }
  }
  
}
