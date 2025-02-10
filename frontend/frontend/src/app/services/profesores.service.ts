import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {

  private apiUrl = 'https://localhots:8080/usuarios/buscar_profesor'; 

  constructor(private http: HttpClient) { }

  getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
