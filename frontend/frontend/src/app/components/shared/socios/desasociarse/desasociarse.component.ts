import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router'; 
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-desasociarse',
  templateUrl: './desasociarse.component.html',
  styleUrls: ['./desasociarse.component.css']
})
export class DesasociarseComponent {
  desasociarseForm: FormGroup;
  private apiUrl = 'https://tu-backend-url.com/api/desasociar';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.desasociarseForm = this.fb.group({});
  }

  confirmDesasociar() {
    const confirmation = confirm("¿Estás seguro de que deseas desasociarte? Esta acción es irreversible.");
    if (confirmation) {
      this.onSubmit(); 
    }
  }

  async onSubmit() {
    try {
      const user = await this.authService.getCurrentUser(); 
      console.log("Usuario actual:", user);

      if (user && user.uid) { 
        const userId = user.uid; 

        const desasociadoData = {
          id: userId,
        };

        this.http.post(this.apiUrl, desasociadoData).subscribe(
          response => {
            console.log("Usuario desasociado con éxito:", response);
            alert('Te has desasociado correctamente.'); 
            this.router.navigate(['/home']); 
          },
          error => {
            console.error("Error al desasociar al usuario:", error);
            alert('Hubo un problema al intentar desasociarte. Por favor, intenta nuevamente.'); 
          }
        );
      } else {
        console.error('El usuario no tiene un ID válido.');
        alert('No se pudo obtener el ID del usuario.'); 
      }
    } catch (error) {
      console.error(error);
      alert('No estás autenticado. Por favor, inicia sesión para desasociarte.');
    }
  }
}
