import { Component } from '@angular/core';
import { MercadopagoService } from '../../../services/mercadopago.service';

@Component({
  selector: 'app-mercadopago',
  templateUrl: './mercadopago.component.html',
  styleUrls: ['./mercadopago.component.css']
})
export class MercadopagoComponent {
  constructor(private mercadopagoService: MercadopagoService) {}

  ngOnInit(): void {
    this.createPreference();
  }

  createPreference() {
    const preference = {
      items: [
        {
          title: 'Reserva cancha - Los Ciruelos Padel Club',
          quantity: 1,
          unit_price: 100.0,
          currency_id: 'ARS'
        }
      ],
      back_urls: {
        success: 'http://localhost:4200/home',
        failure: 'http://localhost:4200/ticket',
        pending: 'http://localhost:4200/ticket'
      },
      auto_return: 'approved'
    };

    this.mercadopagoService.createPreference(preference).subscribe(response => {
      this.loadMercadoPago(response.id); // Usa la nueva preferenceId
    }, error => {
      console.error('Error creando la preferencia:', error);
    });
  }

  loadMercadoPago(preferenceId: string) {
    const mp = new (window as any).MercadoPago('APP_USR-762225fb-73cd-4033-b1ad-4b16b6f579da', {
      locale: 'es-AR'
    });

    const bricksBuilder = mp.bricks();
    bricksBuilder.create("wallet", "wallet_container", {
      initialization: { preferenceId: preferenceId },
      customization: { texts: { valueProp: 'smart_option' } },
    });
  }
}