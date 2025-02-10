import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MisReservasService {

  private apiUrl = 'https://tu-api.com/api/reservas'; // Reemplaza con tu URL de backend

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las reservas realizadas por un usuario específico.
   * @param idUsuario ID del usuario autenticado
   * @returns Lista de reservas
   */
  obtenerReservasPorUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }
}
