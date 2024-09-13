// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonProviders } from '../shared/login/cambiar_contrasenia/button_provider/button_providers.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/components/login']);
  }
}
