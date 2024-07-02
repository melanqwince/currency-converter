import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { DataService } from './shared/services/data.service';

export function initializeApp(dataService: DataService) {
  return () => lastValueFrom(dataService.loadInitData()).then(rates => {
    if (rates) {
      dataService.setConversionRates(rates);
    }
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    DataService,
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [DataService],
      multi: true
    }
  ]
};
