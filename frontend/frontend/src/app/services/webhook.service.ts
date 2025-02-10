import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebhookService {
  private apiUrl = 'https://72d0-186-127-51-24.ngrok-free.app/'; // Reemplázalo con tu URL de Ngrok o backend

  constructor(private http: HttpClient) {}

  enviarDatos(payload: any): Observable<any> {
    console.log('Enviando datos:', payload);
    return this.http.post<any>(this.apiUrl, payload);
  }
}
