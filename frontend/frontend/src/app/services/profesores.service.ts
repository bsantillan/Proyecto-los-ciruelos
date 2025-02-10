import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {

  private apiUrl = 'https://tudominio.com/api/profesores'; // Cambia por tu API

  constructor(private http: HttpClient) { }

  getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
