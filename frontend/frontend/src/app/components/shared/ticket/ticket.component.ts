import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  date!: string;
  court!: string;
  price!: number;
  senia!: string;
  horario_inicio_ocupado!: string;
  horario_fin_ocupado!: string;

  constructor(private route: ActivatedRoute,  private router: Router,) {}

  ngOnInit(): void {
    // Obteniendo parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.date = params['fecha'];
      this.court = params['id_cancha'];
      this.price = params['precio'];
      this.senia = params['senia'];
      this.horario_inicio_ocupado=params['horario_inicio_ocupado'];
      this.horario_fin_ocupado=params['horario_fin_ocupado'];
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
