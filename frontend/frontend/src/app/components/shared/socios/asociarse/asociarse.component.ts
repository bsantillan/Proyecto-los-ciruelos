import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-asociarse',
  templateUrl: './asociarse.component.html',
  styleUrls: ['./asociarse.component.css']
})
export class AsociarseComponent {
  asociarseForm: FormGroup;
  private apiUrl = 'https://tu-backend-url.com/api/asociar'; 

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService 
  ) {
    this.asociarseForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.asociarseForm.valid) {
      const asociarData = this.asociarseForm.value;
      
      try {
        const user = await this.authService.getCurrentUser();
        if (user) {
          asociarData.userId = user.uid; 
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }

      this.http.post(this.apiUrl, asociarData).subscribe(
        response => {
          console.log('Usuario asociado exitosamente:', response);
          this.router.navigate(['/pagina-de-exito']);
        },
        error => {
          console.error('Error al asociar al usuario:', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }

  navigateToMercadoPago() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/mercadopago']);
    } else {
      alert('Por favor, inicia sesión para continuar.');
      this.router.navigate(['/login']);
    }
  }
}
