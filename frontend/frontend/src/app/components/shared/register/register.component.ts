import { Component, inject } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

interface RegisterForm {
  names: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  phones: FormArray<FormControl<string>>;
  playerCategory: FormControl<string>;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  hide = true;
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  maxPhones = 3; // Limitar el número máximo de teléfonos

  playerCategories = [
    'Principiante', 'Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta', 'Sexta', 'Séptima'
  ];

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
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
    confirmPassword: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
    phones: this.formBuilder.array([
      this.formBuilder.control('', {
        validators: [Validators.required, Validators.pattern(/^\d{6,15}$/)],
        nonNullable: true,
      })
    ]),
    playerCategory: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    })
  }, { validators: this.passwordsMatch });

  errorMessages: string[] = [];

  passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
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
      this.form.markAllAsTouched();
      return;
    }

    console.log('Usuario registrado', this.form.value);
    this.router.navigate(['/login']);
  }

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
    if (controls['playerCategory'].invalid) {
      messages.push('Seleccione una categoría de jugador.');
    }
    if (this.phones.length < 1) {
      messages.push('Debe agregar al menos un número de teléfono.');
    } else {
      this.phones.controls.forEach((control, index) => {
        if (control.invalid) {
          messages.push(`Número de teléfono ${index + 1} inválido.`);
        }
      });
    }

    return messages;
  }

  addPhone(): void {
    if (this.phones.length < this.maxPhones) {
      this.phones.push(
        this.formBuilder.control('', {
          validators: [Validators.required, Validators.pattern(/^\d{6,15}$/)],
          nonNullable: true,
        })
      );
    }
  }

  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  getPhoneError(index: number): string | null {
    const phoneControl = this.phones.at(index);
    if (phoneControl.invalid && phoneControl.touched) {
      if (phoneControl.hasError('required')) {
        return 'Este campo es obligatorio.';
      }
      if (phoneControl.hasError('pattern')) {
        return 'Número inválido, debe tener entre 6 y 15 dígitos.';
      }
    }
    return null;
  }

  toggleHide() {
    this.hide = !this.hide;
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
