import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracionGeneral, ConfiguracionService } from '../../../services/configuracion-general.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  @Input() esAsociacion: boolean = false; // Nuevo: Saber si es para asociación

  date!: string;
  court?: string;
  price!: number;
  senia?: string;
  horario_inicio_ocupado?: string;
  horario_fin_ocupado?: string;
  informacion!: string;

  configuracion: ConfiguracionGeneral | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private configuracionService: ConfiguracionService,) { }

  ngOnInit(): void {

    this.configuracion = this.configuracionService.getStoredConfiguracion();

    // Si no la tenemos, la obtenemos del backend
    if (!this.configuracion) {
      this.configuracionService.getConfiguracion().subscribe(config => {
        // Guardamos la configuración para poder usarla más tarde
        this.configuracionService.setConfiguracion(config);
        this.configuracion = config;
        this.price = config.monto_asociacion;
      });
    }

    this.route.queryParams.subscribe(params => {
      // Si el query param `asociacion` es `true`, activamos el modo asociación
      this.esAsociacion = params['asociacion'] === 'true';
      this.date = params['fecha'];

      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 1);

      const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
      const fechaInicioStr = fechaInicio.toLocaleDateString('es-AR', opciones);
      const fechaFinStr = fechaFin.toLocaleDateString('es-AR', opciones);

      this.informacion = `Usted está asociado desde el ${fechaInicioStr} hasta el ${fechaFinStr}.`;



      if (!this.esAsociacion) {
        this.court = params['id_cancha'];
        this.senia = params['senia'];
        this.horario_inicio_ocupado = params['horario_inicio_ocupado'];
        this.horario_fin_ocupado = params['horario_fin_ocupado'];
        this.informacion = 'Detalles sobre la cancha';
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
