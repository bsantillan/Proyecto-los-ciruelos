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
      }),
    });
  }

  ngOnInit(): void {
    // Inicialización si es necesario
  }

  passwordValidator(control: FormControl<string>): { [key: string]: boolean } | null {
    const password = control.value;
    if (password && !/[A-Z]/.test(password)) {
      return { passwordStrength: true };
    }
    return null;
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); 
      return;
    }
  
    const { email, password } = this.form.value;
  
    if (email && password) {
      this.authService.loginWithEmailAndPassword({ email, password })
        .then(async (result) => {
          console.log('Inicio de sesión exitoso', result);
          this.successMessage = 'Ha iniciado sesión con éxito'; 
          this.errorMessage = null; 
          await this.handleRoleRedirect(); 
        })
        .catch((error) => {
          this.handleLoginError(error);
          this.successMessage = null; 
        });
    } else {
      console.error('Email o contraseña no están definidos');
    }
  }
  

  handleLoginError(error: unknown): void {
    if (error instanceof Error) {
      const firebaseError = (error as any).code;
      switch (firebaseError) {
        case 'auth/user-not-found':
          this.errorMessage = 'El correo electrónico no está registrado. Por favor, regístrate primero.';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'La contraseña es incorrecta. Por favor, intenta nuevamente.';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
          break;
        default:
          this.errorMessage = 'El usuario no se encuentra registrado o no ha validado el email';
      }
    } else {
      this.errorMessage = 'Error desconocido. Intenta de nuevo.';
    }
    this.successMessage = null;
  }
  async handleRoleRedirect(): Promise<void> {
    const email = this.form.value.email;

    if (!email) {
        console.error('El email no está definido');
        return;
    }

    const { role } = this.authService.getRoleBasedOnEmail(email);

    switch (role) {
        case 'jugador':
            this.router.navigate(['/home']);
            break;
        case 'empleado':
            this.router.navigate(['/home']);
            break;
        case 'profesor':
            this.router.navigate(['/home']);
            break;
        case 'dueño':
            this.router.navigate(['/home']);
            break;
        default:
            this.router.navigate(['/home']);
    }
}



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

  get isPasswordValid(): string | boolean {
    const control = this.form.get('password');
    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      if (control.hasError('required')) {
        return 'Este campo es obligatorio';
      } else if (control.hasError('minlength')) {
        return 'La contraseña no coincide';
      } else if (control.hasError('passwordStrength')) {
        return 'La contraseña no coincide';
      }
    }

    return false;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}