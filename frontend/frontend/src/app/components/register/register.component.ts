import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: FormGroup;
  hide = true;
  

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.form = this.formBuilder.group({
      names: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      playerCategory: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Cualquier inicialización adicional
  }

  signUp(): void {
    if (this.form.valid) {
      console.log('Registro exitoso:', this.form.value);
      this.router.navigate(['/home']);
    } else {
      console.log('Formulario inválido');
    }
  }

  get isEmailValid(): string | boolean {
    const control = this.form.get('email');
    if (control?.invalid && control.touched) {
      return control.hasError('required')
        ? 'Este campo es obligatorio'
        : 'Ingresa un correo electrónico válido';
    }
    return false;
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
