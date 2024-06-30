import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataService } from '../services/data.service';
import { ConversionRates } from '../interfaces/conversion-rates.interface';
import * as cc from 'currency-codes';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    FormsModule,
    NgSelectModule
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent implements OnChanges {
  @Input('rates') rates!: ConversionRates;
  currencies: { value: string, name: string }[] = [];
  selectedFromCurrency!: string;
  selectedToCurrency!: string;
  amountFromCurrency!: number;
  amountToCurrency!: number;
  
  constructor(private dataService: DataService) {}

  currencyAmountFromChanges() {
    this.amountToCurrency = this.dataService.convertCurrency(this.amountFromCurrency, this.selectedFromCurrency, this.selectedToCurrency, this.rates);
  }

  currencyAmountToChanges() {
    this.amountFromCurrency = this.dataService.convertCurrency(this.amountToCurrency, this.selectedToCurrency, this.selectedFromCurrency, this.rates);
  }

  reverseCurrencies() {
    const selectedFromCurrency = this.selectedFromCurrency;
    this.selectedFromCurrency = this.selectedToCurrency;
    this.selectedToCurrency = selectedFromCurrency;
    this.currencyAmountFromChanges();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['rates'] && changes['rates'].currentValue) {
      this.dataService.defaultCurrencies.forEach((currency) => {
        if (this.rates[currency]) {
          this.currencies.push({ value: currency, name: cc.code(currency)!.currency });
        }
      });
      this.selectedFromCurrency = this.currencies[0].value;
      this.selectedToCurrency = this.currencies[1].value;
      this.amountFromCurrency = 1;
      this.currencyAmountFromChanges();
    }
  }
}
