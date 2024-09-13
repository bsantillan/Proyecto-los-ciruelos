import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;
  form: FormGroup<LoginForm>;
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('', {
        validators: [Validators.required, Validators.pattern(this.emailPattern)],
        nonNullable: true,
      }),
      password: this.formBuilder.control('', {
        validators: [Validators.required, Validators.minLength(6), this.passwordValidator],
        nonNullable: true,
      })
    });
  }

  ngOnInit(): void {
    // Inicialización si es necesario
  }

  // Validación personalizada para la contraseña
  passwordValidator(control: FormControl<string>): { [key: string]: boolean } | null {
    const password = control.value;
    if (password && !/[A-Z]/.test(password)) {
      return { passwordStrength: true };
    }
    return null;
  }

  // Método para ejecutar el login
  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar errores
      return;
    }

    const { email, password } = this.form.value;

    if (email && password) {
      this.authService.loginWithEmailAndPassword({ email, password })
        .then(result => {
          console.log('Inicio de sesión exitoso', result);
          this.successMessage = 'Inicio de sesión exitoso';
          this.errorMessage = null;
          this.handleRoleRedirect();
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            if ((error as any).code === 'auth/user-not-found') {
              this.errorMessage = 'El correo electrónico no está registrado. Por favor, regístrate primero.';
              this.successMessage = null;
            } else if ((error as any).code === 'auth/wrong-password') {
              this.errorMessage = 'La contraseña es incorrecta. Por favor, intenta nuevamente.';
              this.successMessage = null;
            } else {
              this.errorMessage = 'Ocurrió un error desconocido. Por favor, intenta nuevamente.';
              this.successMessage = null;
            }
          } else {
            this.errorMessage = 'Ocurrió un error desconocido. Por favor, intenta nuevamente.';
            this.successMessage = null;
          }
          console.error('Error de inicio de sesión', error);
        });
    } else {
      console.error('Email o contraseña no están definidos');
    }
  }

  // Redirigir según el rol del usuario
  handleRoleRedirect(): void {
    const role = this.authService.getRoleBasedOnEmail();
    if (role === 'jugador') {
      this.router.navigate(['/jugador-home']);
    } else if (role === 'empleado') {
      this.router.navigate(['/empleado-home']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  // Validación específica del campo de email
  get isEmailValid(): string | boolean {
    const control = this.form.get('email');
    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      if (control.hasError('required')) {
        return 'Este campo es obligatorio';
      } else if (control.hasError('pattern')) {
        return 'Ingresa una dirección de correo electrónico válida';
      }
    }

    return false;
  }

  // Validación específica del campo de contraseña
  get isPasswordValid(): string | boolean {
    const control = this.form.get('password');
    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      if (control.hasError('required')) {
        return 'Este campo es obligatorio';
      } else if (control.hasError('minlength')) {
        return 'La contraseña debe tener al menos 6 caracteres';
      } else if (control.hasError('passwordStrength')) {
        return 'La contraseña debe contener al menos una letra mayúscula';
      }
    }

    return false;
  }

  // Método para navegar a la página de registro
  goHome(): void {
    this.router.navigate(['/home']);
  }
}
