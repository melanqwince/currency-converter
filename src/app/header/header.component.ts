import { Component } from '@angular/core';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  priceEUR: number | null = null;
  priceUSD: number | null = null;

  constructor(private dataService: DataService) {
    this.dataService.priceUSD.subscribe((price) => {
      this.priceUSD = price;
      console.log(price);
    });
    this.dataService.priceEUR.subscribe((price) => {
      this.priceEUR = price;
      console.log(price);
    });
  }

}
