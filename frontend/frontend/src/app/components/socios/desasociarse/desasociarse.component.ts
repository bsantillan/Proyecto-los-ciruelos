import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-desasociarse',
  templateUrl: './desasociarse.component.html',
  styleUrls: ['./desasociarse.component.css']
})
export class DesasociarseComponent {
  desasociarseForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    this.desasociarseForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.desasociarseForm.valid) {
      // Llamar al servicio para desasociarse
      console.log('Solicitud de desasociarse enviada:', this.desasociarseForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

  navigateToMercadoPago() {
    // Navega al componente de Mercado Pago
    this.router.navigate(['/mercadopago']);
  }
}

