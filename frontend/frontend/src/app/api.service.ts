import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { catchError, Observable, throwError } from 'rxjs';

export interface Reserva {
  id_cancha: number;
  fecha: string;
  horario_inicio_ocupado: string;  // Hora de inicio
  horario_fin_ocupado: string;    // Hora de finalización
}

export interface TurnoDTO {
  id_cancha: number;
  fecha: string;
  horario_inicio_ocupado: string;
  horario_fin_ocupado: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/'; // Reemplaza con tu URL de backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error en la solicitud HTTP';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del lado del cliente: ${error.error.message}`;
    } else {
      // El backend retornó un código de estado fallido
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  // Método para obtener los turnos
  getTurnos(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl+"public/consultar_turnos")
  }

  bloquearTurno(turnoDTO: TurnoDTO): Observable<any> {
    // Realizar la solicitud PUT a la API con el token en los headers y el cuerpo en turnoDTO
    return this.http.put<string>(this.apiUrl + 'public/bloquear/turno', turnoDTO);
  }  

  async getProtectedData() {
    try {
      const token = await this.authService.getToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return await this.http.get(this.apiUrl, { headers }).toPromise();
    } catch (error) {
      console.error('Error al obtener datos protegidos:', error);
      throw error; 
    }
  }
}
