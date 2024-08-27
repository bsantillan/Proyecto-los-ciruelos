import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule],
  selector: 'app-home',
  template: `
    <mat-toolbar color="accent">
      <span>Home</span>
      <button mat-flat-button (click)="navigateToLogin()">Login</button>
    </mat-toolbar>
  `,
  styles: [
    `mat-toolbar { 
      display: flex;
      justify-content: space-between;
    }`,
  ],
})
export default class HomeComponent {
  constructor(private router: Router) {} // Inyecta Router

  navigateToLogin(): void {
    this.router.navigate(['/components/login']); // Redirige a la página de login
  }
}
