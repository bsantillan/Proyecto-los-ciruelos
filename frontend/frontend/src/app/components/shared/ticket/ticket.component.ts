import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  isReservation: boolean = true; // Cambiar según la lógica de tu aplicación
  date!: string;
  time!: number;
  court!: string;
  price!: number;
  senia!: number;
  duracion!: number;

  constructor(private route: ActivatedRoute,  private router: Router,) {}

  ngOnInit(): void {
    // Obteniendo parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.date = params['date'];
      this.time = params['time'];
      this.court = params['court'];
      this.price = params['price'];
      this.senia = params['senia'];
      this.duracion=params['duracion'];
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
