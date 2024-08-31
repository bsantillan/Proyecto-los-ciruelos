import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { ButtonProviders } from './Cambiar-Contrasenia/button-providers/button-providers.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router'; // Importa Router y RouterModule

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  standalone: true,
  imports: [
    CommonModule, // Asegúrate de incluir CommonModule aquí
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonProviders
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [],
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent {
  hide = true;
  formBuilder = inject(FormBuilder);
  router = inject(Router); // Inyecta Router

  form: FormGroup<LoginForm> = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  Login(): void {
    if (this.form.invalid) return;
    console.log(this.form.value);
  }

  get isEmailValid(): string | boolean {
    const control = this.form.get('email');

    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      return control.hasError('required')
        ? 'Este campo es obligatorio'
        : 'Ingresa una dirección de correo electrónico válida';
    }

    return false;
  }

  goHome(): void {
    this.router.navigate(['/home']); 
  }
}
