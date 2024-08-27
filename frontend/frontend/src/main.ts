import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { appConfig } from './app/app.config';
import  {AppComponent} from './app/app.component';


bootstrapApplication(AppModule);
platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));

  bootstrapApplication(AppComponent, appConfig).catch((error) => console.log(error));
