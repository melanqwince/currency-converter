import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ConverterComponent } from './converter/converter.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { ConversionRates } from './interfaces/conversion-rates.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    HeaderComponent,
    ConverterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DataService]
})
export class AppComponent {
  title = 'currency-converter-test';

  baseUSDRates!: ConversionRates;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getData().subscribe((rates) => {
      //check if rates exist with standart currency - EUR
      if (rates['EUR']) {
        this.baseUSDRates = rates;

        //save default prices for header in UAH
        const priceUSD: number = rates['UAH'];
        const priceEUR: number = this.dataService.convertCurrency(1, 'EUR', 'UAH', rates);
        this.dataService.priceUSD.next(Number(priceUSD.toFixed(2)));
        this.dataService.priceEUR.next(Number(priceEUR.toFixed(2)));
      } else {
        console.error('Error', 'Conversion rates not found');
      }
    });
  }
  
}
