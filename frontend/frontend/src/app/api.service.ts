import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

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

export interface ReservaDTO {
  cantidad_pelotas: number;
  cantidad_paletas: number;
  fecha: string;  // Formato ISO-8601: 'yyyy-MM-dd'
  horario_inicio: string;  // Formato ISO-8601: 'HH:mm:ss'
  horario_fin: string;  // Formato ISO-8601: 'HH:mm:ss'
  numero_cancha: number;
  id_reservador: number | null;
  senia: boolean;
  id_mp: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/'; // Reemplaza con tu URL de backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener los turnos
  getPerfil(): Observable<any> {
    return this.authService.getUserEmail().pipe(
      switchMap(email => {
        if (!email) {
          console.error("Error: No se encontró un email válido.");
          return throwError(() => new Error("No hay usuario autenticado"));
        }
        const url = `${this.apiUrl}public/consultar_perfil?email=${encodeURIComponent(email)}`;
        return this.http.get<any>(url);
      })
    );
  }
  
  // Método para obtener los turnos
  getTurnos(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl+"public/consultar_turnos")
  }

  bloquearTurno(turnoDTO: TurnoDTO): Observable<any> {
    // Realizar la solicitud PUT a la API con el token en los headers y el cuerpo en turnoDTO
    return this.http.put<string>(this.apiUrl + 'public/bloquear/turno', turnoDTO);
  }  

  hacerReserva(reservaDTO: ReservaDTO): Observable<any> {

    return this.authService.getUserEmail().pipe(
      switchMap(email => {
        if (!email) {
          console.error("Error: No se encontró un email válido.");
          return throwError(() => new Error("No hay usuario autenticado"));
        }
        const url = `${this.apiUrl}public/reservas/reservar_turno?email=${encodeURIComponent(email)}`;
        return this.http.post<any>(url, reservaDTO);
      })
    );
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
