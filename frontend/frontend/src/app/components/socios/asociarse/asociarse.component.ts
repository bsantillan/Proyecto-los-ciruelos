import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-asociarse',
  templateUrl: './asociarse.component.html',
  styleUrls: ['./asociarse.component.css']
})
export class AsociarseComponent {
  asociarseForm: FormGroup;

  constructor(private router: Router,private fb: FormBuilder) {
    this.asociarseForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.asociarseForm.valid) {
      // Llamar al servicio para asociarse
      console.log('Formulario enviado:', this.asociarseForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }


  navigateToMercadoPago() {
    // Navega al componente de Mercado Pago
    this.router.navigate(['/mercadopago']);
  }
}
