import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MercadopagoComponent } from './components/mercadopago/mercadopago.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirige a /home por defecto
  { path: 'home',
    loadComponent: () => import('./home/home.component') },
    
      { path: 'components',
        children: [
            { path: 'login', 
              loadComponent: () => import('./components/login/login.component') },
            { path: 'cambiar-contrasenia', 
                loadComponent: () => import('./components/login/Cambiar-Contrasenia/cambiar-contrasenia.component')},
            { path: 'register',
              loadComponent: () => import('./components/register/register.component') },
        ],
    },

    { path: 'mercadopago', component: MercadopagoComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
