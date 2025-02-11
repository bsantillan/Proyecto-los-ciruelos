import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionGeneral, ConfiguracionService } from '../../../services/configuracion-general.service';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent {
  errorMessages: string[] = [];
  pago: 'seña' | 'total' = 'seña'; // Estado del pago
  precio: number = 0; 
  precioPelota = 0;
  precioPaleta = 0; 
  paletas = 0;
  pelotas = 0;

  date!: string;
  court!: string;
  senia!: string;
  horario_inicio_ocupado!: string;
  horario_fin_ocupado!: string;

  isSocio: boolean = false;

  configuracion: ConfiguracionGeneral | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private api: ApiService,  
    private toastrService: ToastrService,
    private configuracionService: ConfiguracionService,
  ) {
    this.api.getPerfil().subscribe((perfil) => {
      console.log(perfil.socio);
      this.isSocio = perfil?.socio ?? false; // Si el campo "socio" es true, se guarda en isSocio
    });
  }

  ngOnInit(): void {

    this.obtenerConfiguracion();

    this.route.queryParams.subscribe(params => {
      this.date = params['fecha'];
      this.court = params['id_cancha'];
      this.horario_inicio_ocupado=params['horario_inicio_ocupado'];
      this.horario_fin_ocupado=params['horario_fin_ocupado'];
    });

    // 💡 Ejecutar calcularPrecio() después de cargar la configuración
    setTimeout(() => {
      this.calcularPrecio();
    }, 100);
  }

  obtenerConfiguracion(): void {
    // Primero revisamos si ya tenemos la configuración almacenada
    this.configuracion = this.configuracionService.getStoredConfiguracion();
  
    if (!this.configuracion) {
      this.configuracionService.getConfiguracion().subscribe(config => {
        this.configuracionService.setConfiguracion(config);
        this.configuracion = config;
        this.precioPaleta = this.configuracion.monto_paletas;
        this.precioPelota = this.configuracion.monto_pelotas;
  
        // Ahora que tenemos la configuración, calculamos el precio inicial
      });
    }
  }

  setPago(opcion: 'seña' | 'total'): void {
    this.pago = opcion;
    this.calcularPrecio();
  }

  calcularPrecio(): void {
    console.log("Actualizando")
    if (this.configuracion) {
      let precioBase = (this.pelotas * this.precioPelota) + (this.paletas * this.precioPaleta) + this.configuracion?.monto_reserva;
  
      if (this.pago === "seña") {
        this.precio = precioBase * this.configuracion.porcentaje_seña;
      } else {
        this.precio = precioBase;
      }
  
      if (this.isSocio) {
        this.precio -= this.configuracion.monto_reserva*this.configuracion.descuento_socio;
      }
  
    }
  }  

  async next() {
    console.log("Pelotas:", this.pelotas);
    console.log("Paletas:", this.paletas);
    console.log("Pago:", this.pago);
    console.log("Precio total:", this.precio);

    this.router.navigate(['/ticket'], {
      queryParams: {
        id_cancha: this.court,
        fecha: this.date,
        horario_inicio_ocupado: this.horario_inicio_ocupado,
        horario_fin_ocupado: this.horario_fin_ocupado,
        precio: this.precio,
        senia: this.pago,
        cantidad_pelotas: this.pelotas,
        cantidad_paletas: this.paletas
      }
    });  
  }
}
