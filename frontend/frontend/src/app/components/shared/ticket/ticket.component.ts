import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MercadopagoService } from '../../../services/mercadopago.service';
import { AuthService } from '../../../services/auth.service';

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
  cantidad_pelotas!: number;
  cantidad_paletas!: number;

  constructor(
    private route: ActivatedRoute,  
    private router: Router, 
    private mercadopagoService: MercadopagoService,
    private authService: AuthService  // Inyecta el servicio de autenticación
  ) {}

  ngOnInit(): void {
    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.date = params['fecha'];
      this.court = params['id_cancha'];
      this.cantidad_paletas = params['cantidad_paletas'];
      this.cantidad_pelotas = params['cantidad_pelotas'];
      this.price = params['precio'];
      this.senia = params['senia'];
      this.horario_inicio_ocupado = params['horario_inicio_ocupado'];
      this.horario_fin_ocupado = params['horario_fin_ocupado'];
    });

    // Verificar si el usuario está autenticado antes de proceder con el pago
    if (!this.authService.isAuthenticated()) {
      // Si el usuario no está autenticado, redirigirlo al login
      this.router.navigate(['/login']);
    } else {
      // Si está autenticado, proceder con la creación de la preferencia
      this.redirectToMercadoPago();
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  // Función para redirigir al usuario a Mercado Pago
  redirectToMercadoPago() {
    const preference = {
      items: [
        {
          title: 'Reserva cancha - Los Ciruelos Padel Club',
          quantity: 1,
          unit_price: parseFloat(this.price.toString()), // Asegúrate de que sea un número
          currency_id: 'ARS',
        }
      ],
      back_urls: {
        success: `http://localhost:4200/procesar-pago?date=${this.date}&horario_inicio_ocupado=${this.horario_inicio_ocupado}&court=${this.court}&price=${this.price}&senia=${this.senia}&horario_fin_ocupado=${this.horario_fin_ocupado}`,
        failure: 'http://localhost:4200/ticket',
        pending: 'http://localhost:4200/ticket'
      },
      auto_return: 'approved',
    };

    this.mercadopagoService.createPreference(preference).subscribe(response => {
      this.loadMercadoPago(response.id);
    }, error => {
      console.error('Error creando la preferencia:', error);
    });
  }

  loadMercadoPago(preferenceId: string) {
    const mp = new (window as any).MercadoPago('APP_USR-762225fb-73cd-4033-b1ad-4b16b6f579da', {
      locale: 'es-AR'
    });

    const bricksBuilder = mp.bricks();
    bricksBuilder.create('wallet', 'wallet_container', {
      initialization: { preferenceId: preferenceId, redirectMode: 'modal' },
      customization: {
        texts: {
          action: 'buy',
          valueProp: 'security_details'
        }
      },
    });
  }
}
