import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.scss'],
})
export class CambiarContraseniaComponent {
  passwordResetForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    // Inicializamos el formulario
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.passwordResetForm.get('email');
  }

  async onSubmit() {
    if (this.passwordResetForm.valid) {
        const emailValue = this.passwordResetForm.value.email;
        try {
            await this.authService.resetPassword(emailValue); 
            alert('Se ha enviado un correo electrónico de confirmación para cambiar la contraseña. Verifique su bandeja de entrada.');
            this.router.navigate(['/login']);
        } catch (error) {
            console.error('Error al enviar el correo de recuperación:', error);
            alert('No se pudo enviar el correo de recuperación. Por favor, inténtelo de nuevo.');
        }
    } else {
        console.log('Correo no válido.');
        alert('Por favor, ingrese un correo electrónico válido.');
    }
}

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
