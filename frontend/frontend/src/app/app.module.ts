import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';


// Importaciones de Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';

// Components
import { AppComponent } from './app.component';
import { MercadopagoComponent } from './components/shared/mercadopago/mercadopago.component';
import { CambiarContraseniaComponent } from './components/shared/login/cambiar_contrasenia/cambiar-contrasenia.component';
import { LoginComponent } from './components/shared/login/login.component';
import { RegisterComponent } from './components/shared/register/register.component';
import { ButtonProviders } from './components/shared/login/cambiar_contrasenia/button_provider/button_providers.component'
import { HomeComponent } from './components/home/home.component';
import { CalendarioReservaComponent } from './components/shared/calendario_reserva/calendario_reserva.component';

// Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';




@NgModule({
  declarations: [
    AppComponent,
    MercadopagoComponent,
    CambiarContraseniaComponent,
    LoginComponent,
    RegisterComponent,
    ButtonProviders,
    CalendarioReservaComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSelectModule,
    NgOptimizedImage,
    FormsModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({"projectId":"proyecto-los-ciruelos","appId":"1:458631280275:web:077d19f3d31ac919ca3f66","storageBucket":"proyecto-los-ciruelos.appspot.com","apiKey":"AIzaSyADexIDOi159hPk8yHrKvBrh8n8OeY5Cpo","authDomain":"proyecto-los-ciruelos.firebaseapp.com","messagingSenderId":"458631280275","measurementId":"G-K0V8KZ571Q"})),
    provideAuth(() => getAuth()),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
