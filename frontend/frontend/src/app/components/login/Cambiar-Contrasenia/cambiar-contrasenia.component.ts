import { Component } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export default class CambiarContraseniaComponent {
  passwordResetForm: FormGroup;

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
}
