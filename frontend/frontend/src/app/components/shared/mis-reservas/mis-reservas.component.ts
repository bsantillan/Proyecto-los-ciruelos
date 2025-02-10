import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MisReservasService } from '../../../services/mis-reservas.service';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css'
})
export class MisReservasComponent {
  usuarioActual: any;
  reservas: any[] = []; 
  reservasFiltradas: any[] = [];

  filtro = {
    fecha: '',
    cancha: ''
  };

  canchas: string[] = ["Cancha 1", "Cancha 2", "Cancha 3", "Cancha 4"]; 

  constructor(
    private authService: AuthService,
    private reservaService: MisReservasService
  ) {}

  ngOnInit(): void {
    // Obtener el usuario logueado
    this.authService.getUsuario().subscribe(usuario => {
      this.usuarioActual = usuario;
      this.obtenerReservas();
    });
  }

  obtenerReservas(): void {
    this.reservaService.obtenerReservasPorUsuario(this.usuarioActual.id).subscribe(reservas => {
      this.reservas = reservas;
      this.filtrarReservas();
    });
  }

  filtrarReservas(): void {
    this.reservasFiltradas = this.reservas.filter(reserva => {
      return (
        (!this.filtro.fecha || reserva.fecha === this.filtro.fecha) &&
        (!this.filtro.cancha || reserva.cancha === this.filtro.cancha)
      );
    });
  }
}
