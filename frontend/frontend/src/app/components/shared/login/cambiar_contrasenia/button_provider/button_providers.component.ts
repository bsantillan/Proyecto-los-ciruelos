import { Component, Input } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-button-providers',
  templateUrl: './button_providers.component.html',
  styleUrls: ['./button_providers.component.css']
})
export class ButtonProviders{
  @Input() isLogin: boolean = true; // Default to true for login

  constructor(private authService: AuthService) {}

  signInWithGoogle(): void {
    this.authService.signInWithGoogleProvider().then((result) => {
      // Maneja el resultado del inicio de sesión
      console.log('Inicio de sesión exitoso con Google:', result);
    }).catch((error) => {
      // Maneja el error
      console.error('Error durante el inicio de sesión con Google:', error);
    });
  }
}
