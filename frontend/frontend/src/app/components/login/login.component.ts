import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonProviders } from './Cambiar-Contrasenia/button-providers/button-providers.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  hide= true;
  constructor(private fb: FormBuilder, private router: Router) {
    // Inicializamos el formulario
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Cualquier inicialización adicional
  }

  login(): void {
    // Verificar si el formulario es válido
    if (this.form.valid) {
      console.log('Login exitoso:', this.form.value);
      // Navegar al home después de login exitoso
      this.router.navigate(['/home']);
    } else {
      console.log('Formulario inválido');
    }
  }

  goHome(): void {
    this.router.navigate(['/home']); 
  }
}