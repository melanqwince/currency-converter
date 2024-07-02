import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CurrencySelection } from '@app/shared/interfaces/currency-selection.interface';

@Component({
  selector: 'app-currency-selector',
  standalone: true,
  imports: [FormsModule, NgSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencySelectorComponent),
      multi: true
    }
  ],
  templateUrl: './currency-selector.component.html',
  styleUrl: './currency-selector.component.scss'
})
export class CurrencySelectorComponent implements ControlValueAccessor {
  @Input() currencies: { value: string, name: string }[] = [];

  selectedCurrency!: string;
  amountCurrency!: number;

  onChange: (value: CurrencySelection) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: CurrencySelection): void {
    if (value) {
      this.selectedCurrency = value.selectedCurrency;
      this.amountCurrency = value.amountCurrency;
    }
  }

  currencyAmountChanges(): void {
    this.onChange({
      selectedCurrency: this.selectedCurrency,
      amountCurrency: this.amountCurrency
    });
    this.onTouched();
  }

  registerOnChange(fn: (value: CurrencySelection) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }


}
