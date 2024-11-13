// Importaciones necesarias
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { sendEmailVerification } from 'firebase/auth';
import { UserCredential } from 'firebase/auth';

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
  isGoogleSignInInProgress = false;
  isEmailVerified: boolean = false;
  userCredential: any;
  showResendButton: boolean = false;

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

  ngOnInit() {
    this.checkUserStatus();
  }

  passwordValidator(control: FormControl<string>): { [key: string]: boolean } | null {
    const password = control.value;
    if (password && !/[A-Z]/.test(password)) {
      return { passwordStrength: true };
    }
    return null;
  }

  

  checkUserStatus() {
    if (this.userCredential && this.userCredential.user) {
      this.isEmailVerified = this.userCredential.user.emailVerified;
      this.showResendButton = !this.isEmailVerified; 
    }
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
        this.userCredential = result; 
        this.checkUserStatus();
        this.successMessage = 'Ha iniciado sesión con éxito';
        this.errorMessage = null; 
        await this.handleRoleRedirect();
      })
      .catch((error) => {
        this.handleLoginError(error);
        this.successMessage = null;
        this.showResendButton = error.code === 'auth/email-not-verified';
      });
  }
}

  

handleLoginError(error: unknown): void {
  this.errorMessage = 'No puedes iniciar sesión aún. Debes verificar tu correo electrónico. Revisa tu bandeja de entrada y haz clic en el enlace de confirmación. ¿No recibiste el correo?';
  this.showResendButton = true;  

  if (typeof error === 'object' && error !== null && 'code' in error) {
      const firebaseErrorCode = (error as any).code;
      const errorMessages: { [key: string]: string } = {
          'auth/user-not-found': 'Nombre de usuario y/o contraseña incorrecta.',
          'auth/wrong-password': 'Nombre de usuario y/o contraseña incorrecta.',
          'auth/email-not-verified': this.errorMessage, 
      };
      this.errorMessage = errorMessages[firebaseErrorCode] || 'Nombre de usuario y/ o contraseña incorrecta';
  }
}

  
  onGoogleLogin(): void {
    this.isGoogleSignInInProgress = true; 
    this.authService.loginWithGoogleProvider()
      .then(async userData => {
        if (userData) {
          console.log('Inicio de sesión con Google exitoso', userData);
          this.router.navigate(['/home']);
        } else {
          console.log('No se pudo iniciar sesión con Google');
        }
      })
      .catch(error => {
        console.error('Error en la autenticación de Google:', error);
        alert('Hubo un error al iniciar sesión con Google. Por favor, intenta de nuevo.');
      })
      .finally(() => {
        this.isGoogleSignInInProgress = false; 
      });
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
      case 'empleado':
      case 'profesor':
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
        return 'Nombre de usuario y/ o contraseña incorrecta';
      } else if (control.hasError('passwordStrength')) {
        return 'Se solicita que ambos campos esten completos';
      }
    }

    return false;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
