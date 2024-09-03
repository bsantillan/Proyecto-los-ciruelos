import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { appConfig } from './app/app.config';
import  {AppComponent} from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


bootstrapApplication(AppModule, {
  providers: [provideAnimationsAsync(), provideAnimationsAsync()]
});
platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));

  bootstrapApplication(AppComponent, appConfig).catch((error) => console.log(error));
