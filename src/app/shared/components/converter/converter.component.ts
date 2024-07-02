import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '@app/shared/services/data.service';
import { CurrencySelectorComponent } from '@app/shared/components/currency-selector/currency-selector.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConversionRates } from '@app/shared/interfaces/conversion-rates.interface';
import { CurrencySelection } from '@app/shared/interfaces/currency-selection.interface';
import * as cc from 'currency-codes';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    CurrencySelectorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent implements OnInit, OnChanges {
  @Input('rates') rates!: ConversionRates;
  currencies: { value: string, name: string }[] = [];

  converterForm!: FormGroup;
  
  constructor(
    private dataService: DataService,
    private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rates'] && changes['rates'].currentValue) {
      this.dataService.defaultCurrencies.forEach((currency) => {
        if (this.rates[currency]) {
          this.currencies.push({ value: currency, name: cc.code(currency)!.currency });
        }
      });
    }
  }

  ngOnInit() {
    this.buildForm();
    this.handleCurrencyChanges('currencyFrom', 'currencyTo');
    this.handleCurrencyChanges('currencyTo', 'currencyFrom');
  }

  buildForm() {
    this.converterForm = this.fb.group({
      currencyFrom: this.fb.control({ selectedCurrency: this.currencies[0].value, amountCurrency: 1 }),
      currencyTo: this.fb.control({ selectedCurrency: this.currencies[1].value, amountCurrency: this.calculateAmount(1, this.currencies[0].value, this.currencies[1].value) })
    });
  }

  handleCurrencyChanges(changedControlName: string, targetControlName: string) {
    this.converterForm.get(changedControlName)!.valueChanges.subscribe((val: CurrencySelection) => {
      const targetControl = this.converterForm.get(targetControlName)!.value;
      const amountCurrency = this.calculateAmount(val.amountCurrency, val.selectedCurrency, targetControl.selectedCurrency);
      this.converterForm.patchValue({
        [targetControlName]: {
          amountCurrency,
          selectedCurrency: targetControl.selectedCurrency
        }
      }, { emitEvent: false });
    });
  }

  calculateAmount(amountFromCurrency: number, selectedFromCurrency: string, selectedToCurrency: string): number {
    return this.dataService.convertCurrency(amountFromCurrency, selectedFromCurrency, selectedToCurrency, this.rates);
  }

  reverseCurrencies() {
    const currencyFromControl = this.converterForm.get('currencyFrom')!;
    const currencyToControl = this.converterForm.get('currencyTo')!;
  
    const { selectedCurrency: selectedFromCurrency, amountCurrency: amountFromCurrency } = currencyFromControl.value;
    const { selectedCurrency: selectedToCurrency, amountCurrency: amountToCurrency } = currencyToControl.value;
  
    currencyToControl.patchValue({
      selectedCurrency: selectedFromCurrency,
      amountCurrency: amountToCurrency
    }, { emitEvent: false });
  
    currencyFromControl.patchValue({
      selectedCurrency: selectedToCurrency,
      amountCurrency: amountFromCurrency
    });
  }
}
