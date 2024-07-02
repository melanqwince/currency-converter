import { Component } from '@angular/core';
import { DataService } from '@app/shared/services/data.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  priceEUR!: number;
  priceUSD!: number;

  constructor(private dataService: DataService) {

    const priceObserver = {
      next: (price: { usd: number, eur: number } | null) => {
        if (price) {
          this.priceUSD = price.usd;
          this.priceEUR = price.eur;
        }
      },
      error: (error: Error) => {
        console.error('Error:', error.message);
      }
    };

    this.dataService.pricesToUAH.subscribe(priceObserver);
  }

}
