import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MercadopagoComponent } from './components/mercadopago/mercadopago.component';
import { LoginComponent } from './components/login/login.component';
import { CambiarContraseniaComponent } from './components/login/Cambiar-Contrasenia/cambiar-contrasenia.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cambiar-contrasenia', component: CambiarContraseniaComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mercadopago', component: MercadopagoComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
