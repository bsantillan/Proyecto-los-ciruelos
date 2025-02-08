import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://your-backend-endpoint.com/protected'; // Reemplaza con tu URL de backend

  constructor(private http: HttpClient, private authService: AuthService) {}

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
