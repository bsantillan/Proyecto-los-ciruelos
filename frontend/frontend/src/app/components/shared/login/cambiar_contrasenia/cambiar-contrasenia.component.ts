import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.scss'],
})
export class CambiarContraseniaComponent {
  passwordResetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    // Inicializamos el formulario
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.passwordResetForm.get('email');
  }

  onSubmit() {
    if (this.passwordResetForm.valid) {
      const emailValue = this.passwordResetForm.value.email;
      console.log('Correo válido:', emailValue);
      alert('Se ha enviado un correo electrónico de confirmación para cambiar la contraseña.');
      // Redirigir al usuario al login después de un envío exitoso
      this.router.navigate(['/login']);
    } else {
      console.log('Correo no válido.');
      alert('Por favor, ingrese un correo electrónico válido.');
    }
  }

  goBack(): void {
    // Redirigir al usuario a la página de login
    this.router.navigate(['/login']);
  }
}
