import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService {
  // Usa tu token de acceso en la URL de la API
  private baseUrl = 'https://api.mercadopago.com/checkout/preferences?access_token=APP_USR-6872871786610767-081919-da037a7edf9b5bef252bbe785df22222-1954862914';

  constructor(private http: HttpClient) { }

  createPreference(preferenceData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, preferenceData);
  }
}

