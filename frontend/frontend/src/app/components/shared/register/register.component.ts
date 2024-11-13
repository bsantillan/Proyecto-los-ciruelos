import { Component, inject } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthService, Credential } from '../../../services/auth.service';

interface RegisterForm {
  names: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  hidePassword = true;
  hideConfirmPassword = true;
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  passwordMismatch = false;
  userEmail: string = '';
  userNames: string = '';
  userLastName: string = '';
  isGoogleSignInInProgress = false;
  errorMessages: string[] = []; 

  
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;


  passwordRequirements = {
    minLength: false,
    hasUpperCase: false,
    hasNumber: false
  };
  showPasswordRequirements = false;

  
  form: FormGroup<RegisterForm> = this.formBuilder.group({
    names: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    lastName: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.pattern(this.emailPattern)],
      asyncValidators: [this.emailTakenValidator()],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])/)], 
      nonNullable: true,
    }),
    confirmPassword: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    })
  }, { validators: this.passwordsMatch });

  passwordsMismatch: boolean = false; 


  constructor(private authService: AuthService) {
    this.form.get('password')?.valueChanges.subscribe((value) => {
      this.checkPasswordStrength(value);
    });
    this.form.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    }); 
  }

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }

  checkPasswordStrength(password: string) {
    this.passwordRequirements.minLength = password.length >= 6;
    this.passwordRequirements.hasUpperCase = /[A-Z]/.test(password);
    this.passwordRequirements.hasNumber = /\d/.test(password);
  }

  onFocusPassword(): void {
    this.showPasswordRequirements = true;
  }

  onBlurPassword(): void {
    if (!this.form.get('password')?.value) {
      this.showPasswordRequirements = false;
    }
  }

  handleUserData(event: { names: string; lastName: string; email: string }): void {
    this.userNames = event.names;
    this.userLastName = event.lastName;
    this.userEmail = event.email;
  }

  emailTakenValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const takenEmails = ['test@example.com', 'user@domain.com'];
      return of(takenEmails.includes(control.value)).pipe(
        delay(1000),
        map(isTaken => (isTaken ? { emailTaken: true } : null))
      );
    };
  }
  signUp(): void {
    if (this.form.invalid) {
      this.errorMessages = this.getFormErrors();
      return;
    }
  
    const credential: Credential = {
      email: this.form.get('email')?.value || '',
      password: this.form.get('password')?.value || '',
    };

    this.authService.isEmailRegistered(credential.email)
      .then(isRegistered => {
        if (isRegistered) {
          alert('Ya tienes una cuenta asociada a este correo. Por favor, inicia sesión.');
          this.router.navigate(['/login']);
          return;
        }
        
        return this.authService.registerWithEmailAndPassword(credential)
          .then(() => {
            alert('Registro exitoso. Verifica tu correo electrónico para completar la validación.');
            this.router.navigate(['/postregister']);
          });
      })
      .catch(error => {
        console.error('Error en el registro:', error);
        this.errorMessages.push(error.message || 'Error desconocido');
      });
  }
  

onGoogleSignIn(): void {
  this.isGoogleSignInInProgress = true; 
  this.authService.loginWithGoogleProvider()
      .then(async userData => {
          if (userData) {
              this.fillFormWithGoogleData(userData);

              alert('Registro exitoso. Verifica tu correo electrónico para completar la validación.');
              this.router.navigate(['/postregister']);
          } else {
              alert('No se pudo completar el registro con Google.');
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


  
  
  fillFormWithGoogleData(userData: any) {
    this.form.patchValue({
      names: userData.name,
      lastName: userData.lastName,
      email: userData.email,
    });
  }
  

  
errorMessage: string = '';
getFormErrors(): string[] {
  const messages: string[] = [];
  const controls = this.form.controls;

  if (controls['names'].invalid) {
      messages.push('El nombre es obligatorio.');
  }
  if (controls['lastName'].invalid) {
      messages.push('El apellido es obligatorio.');
  }
  if (controls['email'].invalid) {
      if (controls['email'].hasError('required')) {
          messages.push('Correo electrónico es obligatorio.');
      }
      if (controls['email'].hasError('pattern')) {
          messages.push('Correo electrónico inválido.');
      }
      if (controls['email'].hasError('emailTaken')) {
          messages.push('Correo electrónico ya registrado.');
      }
  }
  if (controls['password'].invalid) {
      if (controls['password'].hasError('required')) {
          messages.push('Contraseña es obligatoria.');
      }
      if (controls['password'].hasError('minlength')) {
          messages.push('Contraseña debe tener al menos 6 caracteres.');
      }
      if (controls['password'].hasError('pattern')) {
          messages.push('Contraseña debe incluir al menos una letra mayúscula.');
      }
  }
  if (controls['confirmPassword'].invalid) {
      if (controls['confirmPassword'].hasError('required')) {
          messages.push('Confirmar contraseña es obligatorio.');
      }
      if (controls['confirmPassword'].hasError('minlength')) {
          messages.push('Confirmar contraseña debe tener al menos 6 caracteres.');
      }
  }

  if (this.form.hasError('mismatch')) {
      messages.push('Las contraseñas no coinciden.'); 
  }

  return messages;
}


private generateErrorMessage(): void {
  this.errorMessages = this.getFormErrors(); 

  if (this.passwordMismatch) {
      this.errorMessages.push('Las contraseñas deben coincidir.');
  }


  if (this.errorMessages.length > 0) {
      this.errorMessage = this.errorMessages.join(' ');
  } else {
      this.errorMessage = '';
  }
}



checkValidations() {
  Object.keys(this.form.controls).forEach(controlName => {
    const control = this.form.get(controlName);
    if (control) {
      control.markAsTouched();
    }
  });
}


checkPasswordMatch(): void {
  const password = this.form.get('password')?.value;
  const confirmPassword = this.form.get('confirmPassword')?.value;


  this.passwordMismatch = password !== confirmPassword;


  if (this.passwordMismatch) {
    this.form.get('confirmPassword')?.setErrors({ mismatch: true });
  } else {
    this.form.get('confirmPassword')?.setErrors(null); 
  }
  this.form.updateValueAndValidity(); 
}



  toggleHidePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  isRegisterButtonEnabled: boolean = false;


checkFormValidity() {
  this.isRegisterButtonEnabled = this.form.valid && !this.passwordMismatch;
}
  toggleHideConfirmPassword(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
    this.checkPasswordMatch(); 
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}  