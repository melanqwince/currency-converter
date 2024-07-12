import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '@app/shared/services/data.service';
import { CurrencySelectorComponent } from '@app/shared/components/currency-selector/currency-selector.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConversionRates } from '@app/shared/interfaces/conversion-rates.interface';
import { CurrencySelection } from '@app/shared/interfaces/currency-selection.interface';
import * as cc from 'currency-codes';
import { Subject, takeUntil } from 'rxjs';


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
  @Input('rates') rates: ConversionRates | null = null;
  currencies: { value: string, name: string }[] = [];

  converterForm!: FormGroup;

  private destroy$ = new Subject<void>();
  
  constructor(
    private dataService: DataService,
    private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.hasRatesChanged(changes)) {
      this.updateCurrencies();
    }
  }
  
  private hasRatesChanged(changes: SimpleChanges): boolean {
    return changes['rates'] && changes['rates'].currentValue;
  }
  
  private updateCurrencies(): void {
    this.dataService.defaultCurrencies.forEach((currency) => {
      if (this.isRateAvailable(currency)) {
        this.addCurrency(currency);
      }
    });
  }
  
  private isRateAvailable(currency: string): boolean {
    return !!this.rates![currency];
  }
  
  private addCurrency(currency: string): void {
    const currencyCode = cc.code(currency);
    if (currencyCode) {
      this.currencies.push({ value: currency, name: currencyCode.currency });
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
    this.converterForm.get(changedControlName)!.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (val: CurrencySelection) => {
        const targetControl = this.converterForm.get(targetControlName)!.value;
        const amountCurrency = this.calculateAmount(val.amountCurrency, val.selectedCurrency, targetControl.selectedCurrency);
        this.converterForm.patchValue({
          [targetControlName]: {
            amountCurrency,
            selectedCurrency: targetControl.selectedCurrency
          }
        }, { emitEvent: false });
      },
      error: (error: Error) => {
        console.error('Error:', error.message);
      }
    });
  }

  calculateAmount(amountFromCurrency: number, selectedFromCurrency: string, selectedToCurrency: string): number {
    return this.dataService.convertCurrency({
      amount: amountFromCurrency,
      fromCurrency: selectedFromCurrency, 
      toCurrency: selectedToCurrency, 
      rates: this.rates!
    });
  }

 reverseCurrencies() {
  const { currencyFrom, currencyTo } = this.converterForm.controls;

  const currencyFromValue = currencyFrom.value;
  const currencyToValue = currencyTo.value;

  currencyFrom.patchValue({
    selectedCurrency: currencyToValue.selectedCurrency,
    amountCurrency: currencyToValue.amountCurrency
  });

  currencyTo.patchValue({
    selectedCurrency: currencyFromValue.selectedCurrency,
    amountCurrency: currencyFromValue.amountCurrency
  }, { emitEvent: false });
}

  ngOnDestroy(): void {
    // Emit a value to the destroy$ subject to notify subscribers to complete
    this.destroy$.next();
    // Complete the destroy$ subject
    this.destroy$.complete();
  }
}
