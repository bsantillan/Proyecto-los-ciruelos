// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router'; // Importa Router para la navegación
import { MatIconModule } from '@angular/material/icon';
import { ButtonProviders } from '../components/login/Cambiar-Contrasenia/button-providers/button-providers.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule, 
    RouterModule,
    ButtonProviders,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export default class HomeComponent {
  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/components/login']);
  }
}
