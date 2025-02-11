import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Observable, switchMap, throwError } from 'rxjs';

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

  getProfesores(email?: string, nombre?: string, apellido?: string): Observable<any[]> {
    let url = `${this.apiUrl}public/consultar/usuarios/buscar_profesor?`;
    const params = [];

    if (email) params.push(`email=${email}`);
    if (nombre) params.push(`nombre=${nombre}`);
    if (apellido) params.push(`apellido=${apellido}`);

    url += params.join("&");

    return this.http.get<any[]>(url , { responseType: 'json' });
  }

  getResrvas(): Observable<any[]> {
    return this.authService.getUserEmail().pipe(
      switchMap(email => {
        if (!email) {
          console.error("Error: No se encontró un email válido.");
          return throwError(() => new Error("No hay usuario autenticado"));
        }
        const url = `${this.apiUrl}public/consultar/reservas?email=${encodeURIComponent(email)}`;
        return this.http.get<any[]>(url);
      })
    );
  }

  cancelarReserva(reserva_id: number): Observable<string> {
    return this.authService.getUserEmail().pipe(
      switchMap(email => {
        if (!email) {
          console.error("Error: No se encontró un email válido.");
          return throwError(() => new Error("No hay usuario autenticado"));
        }

        // Objeto con los datos a enviar en el cuerpo
        const requestBody = {
          email: encodeURIComponent(email),
          reservaId: reserva_id
        };

        const url = `${this.apiUrl}public/cancelar/reserva`;
        return this.http.put<string>(url, requestBody);
      })
    );
  }
  
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
}
