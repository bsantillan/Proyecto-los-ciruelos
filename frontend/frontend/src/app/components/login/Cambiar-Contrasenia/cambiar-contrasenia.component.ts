import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router'; // Importa Router y RouterModule
import { MatIconModule } from '@angular/material/icon';



@Component({
  standalone: true,
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule

  ]
})
export default class CambiarContraseniaComponent {
  passwordResetForm: FormGroup;
  
  router = inject(Router); // Inyecta Router

  constructor(private fb: FormBuilder) {
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
    } else {
      console.log('Correo no válido.');
      alert('Por favor, ingrese un correo electrónico válido.');
    }
  }

  goBack(): void {
    this.router.navigate(['/components/login']); // Navega hacia atrás en la ruta
  }
}


