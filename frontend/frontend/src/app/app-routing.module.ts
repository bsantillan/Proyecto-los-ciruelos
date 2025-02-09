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


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cambiar-contrasenia', component: CambiarContraseniaComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'postregister', component: PostRegisterComponent},
  { path: 'mercadopago', component: MercadopagoComponent },
  { path: 'reestablecer-contrasenia', component: ReestablecerContraseniaComponent },
  { path: 'verificar-correo', component: VerificarCorreoComponent},
  { path: 'ticket', component: TicketComponent },
  { path: 'action/:actionType/:oobCode', component: AuthActionComponent }, 
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }