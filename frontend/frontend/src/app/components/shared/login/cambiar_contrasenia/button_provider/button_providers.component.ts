import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../../services/auth.service';
import { Router } from '@angular/router'; // Importa Router

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

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { 
    this.form = this.fb.group({
      name: [''],
      email: ['']
    });
  }

  signInWithGoogle(): void {
    this.isGoogleSignInInProgress = true; 

    this.authService.loginWithGoogleProvider().then(async (userData) => {
      if (userData) {
        console.log('Inicio de sesión exitoso con Google:', userData);

        localStorage.setItem('firebaseToken', await userData.user.getIdToken());
        const email = userData.user.email;
        const name = userData.user.displayName;

        //Verificar si el email esta registrado en el Backend, si lo esta redireccionar al home, sino al postregister
        this.router.navigate(['/home'], {
          queryParams: {  email: email, name: name  }
        });
      }
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
