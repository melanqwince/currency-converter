import { Component } from '@angular/core';
import { DataService } from '../../shared/services/data.service';


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
    this.dataService.pricesToUAH.subscribe((price) => {
      if (price) {
        this.priceUSD = price.usd;
        this.priceUSD = price.eur;
      }
    });
  }

}
