import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionService } from '../../../services/configuracion-general.service';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-modificar_valores',
  templateUrl: './modificar_valores.component.html',
  styleUrls: ['./modificar_valores.component.css']
})
export class ModificarValoresComponent implements OnInit {
  form!: FormGroup;
  configuracion: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private configuracionService: ConfiguracionService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      precioCancha1: [0, [Validators.required, Validators.min(0)]],
      precioCancha2: [0, [Validators.required, Validators.min(0)]],
      precioCancha3: [0, [Validators.required, Validators.min(0)]],
      precioCancha4: [0, [Validators.required, Validators.min(0)]],
      precioPelota: [0, [Validators.required, Validators.min(0)]],
      precioPaleta: [0, [Validators.required, Validators.min(0)]],
      stockPelotas: [0, [Validators.required, Validators.min(0)]],
      stockPaletas: [0, [Validators.required, Validators.min(0)]],
    });

    this.obtenerConfiguracion();
  }

  obtenerConfiguracion(): void {
    this.configuracionService.getConfiguracion().subscribe(config => {
      this.configuracion = config;

      this.form.patchValue({
        precioCancha1: this.configuracion.precio_cancha_1,
        precioCancha2: this.configuracion.precio_cancha_2,
        precioCancha3: this.configuracion.precio_cancha_3,
        precioCancha4: this.configuracion.precio_cancha_4,
        precioPelota: this.configuracion.monto_pelotas,
        precioPaleta: this.configuracion.monto_paletas,
        stockPelotas: this.configuracion.stock_pelotas,
        stockPaletas: this.configuracion.stock_paletas,
      });
    });
  }

  guardarConfiguracion(): void {
    if (this.form.invalid) {
      this.toastrService.error('Por favor, complete todos los campos correctamente.');
      return;
    }

    const formValues = this.form.value;

    const nuevaConfiguracion = {
      precio_cancha_1: formValues.precioCancha1,
      precio_cancha_2: formValues.precioCancha2,
      precio_cancha_3: formValues.precioCancha3,
      precio_cancha_4: formValues.precioCancha4,
      monto_pelotas: formValues.precioPelota,
      monto_paletas: formValues.precioPaleta,
      stock_pelotas: formValues.stockPelotas,
      stock_paletas: formValues.stockPaletas
    };

    // Enviar al servidor la nueva configuración
    this.apiService.updateConfiguracion(nuevaConfiguracion).subscribe(
      response => {
        this.toastrService.success('Configuración actualizada con éxito');
      },
      error => {
        this.toastrService.error('Hubo un error al actualizar la configuración');
      }
    );
  }

  // Método para sumar más mercadería (stock)
  sumarStock(tipo: 'pelotas' | 'paletas', cantidad: number): void {
    if (cantidad <= 0) {
      this.toastrService.error('La cantidad debe ser mayor que 0.');
      return;
    }

    if (tipo === 'pelotas') {
      this.form.patchValue({
        stockPelotas: this.form.get('stockPelotas')?.value + cantidad
      });
    } else {
      this.form.patchValue({
        stockPaletas: this.form.get('stockPaletas')?.value + cantidad
      });
    }
  }
}
