// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, RouterModule} from '@angular/router';
import { routes } from './app-routing.module';
import { firebaseProviders } from './firebase.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

const NO_NG_MODULES = importProvidersFrom([BrowserAnimationsModule]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    firebaseProviders.providers,
    NO_NG_MODULES,
     {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
       useValue: {
          appearance: 'outline',
          color: 'accent',
        },
      },
  ],
};
