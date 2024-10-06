import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-button-providers',
  templateUrl: './button_providers.component.html',

  styleUrls: ['./button_providers.component.css']
})
export class ButtonProviders {
  @Input() isLogin: boolean = true; // Por defecto true para login
  @Output() googleData = new EventEmitter<any>(); // Emitir los datos de Google

  form: FormGroup;
  isGoogleSignInInProgress: boolean = false; // Variable para controlar el progreso del login con Google
  errorMessages: string[] = [];  // Agregar propiedad errorMessages
  isRegisteringWithGoogle: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    // Crear el formulario vacío
    this.form = this.fb.group({
      name: [''],
      email: ['']
    });
  }
  signInWithGoogle(): void {
    this.isRegisteringWithGoogle = true; // Indica que el usuario está intentando registrarse con Google
  
    this.authService.signInWithGoogleProvider()
      .then((userData) => {
        // Maneja el resultado del inicio de sesión
        console.log('Inicio de sesión exitoso con Google:', userData);
  

        this.googleData.emit(userData); 
      })
      .catch((error) => {
        // Maneja el error
        console.error('Error durante el inicio de sesión con Google:', error);
      })
      .finally(() => {
        this.isRegisteringWithGoogle = false; // Resetea el estado después de intentar el registro
      });
  }
  



fillFormWithGoogleData(userData: any): void {
  this.form.patchValue({
    name: userData.name || '',
    email: userData.email || ''
  });
}

}