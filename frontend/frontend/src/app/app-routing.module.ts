import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MercadopagoComponent } from './components/shared/mercadopago/mercadopago.component';
import { LoginComponent } from './components/shared/login/login.component';
import { CambiarContraseniaComponent } from './components/shared/login/cambiar_contrasenia/cambiar-contrasenia.component';
import { RegisterComponent } from './components/shared/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { PostRegisterComponent } from './components/shared/register/postregister/postregister.component';
import { ReestablecerContraseniaComponent } from './components/shared/reestablecer_contrasenia/reestalecer_contrasenia.component';
import { VerificarCorreoComponent } from './components/shared/verificar-correo/verificar-correo.component';
import { AuthActionComponent } from './handle-action.component';
import { TicketComponent } from './components/shared/ticket/ticket.component';
import { ReservaComponent } from './components/shared/reserva/reserva.component';
import { authGuard } from './auth/auth.guard'; // Importar el guard
import { noAuthGuard } from './auth/no-auth.guard';
import { ProcesarPagoComponent } from './components/shared/procesar-pago/procesar-pago.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'cambiar-contrasenia', component: CambiarContraseniaComponent, canActivate: [noAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
  { path: 'postregister', component: PostRegisterComponent, canActivate: [noAuthGuard] },
  { path: 'reestablecer-contrasenia', component: ReestablecerContraseniaComponent, canActivate: [noAuthGuard] },
  { path: 'verificar-correo', component: VerificarCorreoComponent, canActivate: [noAuthGuard] },
  { path: 'mercadopago', component: MercadopagoComponent, canActivate: [authGuard] },
  { path: 'ticket', component: TicketComponent, canActivate: [authGuard] },
  { path: 'reserva', component: ReservaComponent, canActivate: [authGuard] },
  { path: 'procesar-pago', component: ProcesarPagoComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
