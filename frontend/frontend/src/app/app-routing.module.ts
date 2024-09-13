import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MercadopagoComponent } from './components/shared/mercadopago/mercadopago.component';
import { LoginComponent } from './components/shared/login/login.component';
import { CambiarContraseniaComponent } from './components/shared/login/cambiar_contrasenia/cambiar-contrasenia.component';
import { RegisterComponent } from './components/shared/register/register.component';
import { HomeComponent } from './components/home/home.component';



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
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
