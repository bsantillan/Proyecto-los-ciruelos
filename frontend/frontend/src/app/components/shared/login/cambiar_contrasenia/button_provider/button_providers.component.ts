import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-button-providers',
  templateUrl: './button_providers.component.html',
  styleUrls: ['./button_providers.component.css']
})
export class ButtonProviders {
  @Input() isLogin: boolean = true; 
  @Output() googleData = new EventEmitter<any>(); 

  form: FormGroup;
  isGoogleSignInInProgress: boolean = false; 
  errorMessages: string[] = []; 

  constructor(private authService: AuthService, private fb: FormBuilder) {
    // Crear el formulario vacío
    this.form = this.fb.group({
      name: [''],
      email: ['']
    });
  }

  signInWithGoogle(): void {
    this.isGoogleSignInInProgress = true; 
  
    const authMethod = this.isLogin ? this.authService.loginWithGoogleProvider() : this.authService.signInWithGoogleProvider();

    authMethod
      .then((userData) => {
        console.log('Inicio de sesión exitoso con Google:', userData);
        this.googleData.emit(userData);
        this.fillFormWithGoogleData(userData); 
      })
      .catch((error) => {
        console.error('Error durante el inicio de sesión con Google:', error);
        this.errorMessages.push('Error durante el inicio de sesión con Google. Intenta nuevamente.');
      })
      .finally(() => {
        this.isGoogleSignInInProgress = false; 
      });
  }

  
  fillFormWithGoogleData(userData: any): void {
    this.form.patchValue({
      name: userData.name || '',
      email: userData.email || ''
    });
  }
}
