import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  modoEdicion: boolean = false;
  datosOriginales: any = {};

  nivelesDeJuego: string[] = [
    'Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta', 'Sexta', 'Séptima', 'Principiante'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(25)]],
      apellido: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^\d{1,10}$/) // Hasta 10 dígitos numéricos
      ]],
      codigoArea: ['', [
        Validators.required,
        Validators.pattern(/^\d{1,3}$/) // Hasta 3 dígitos numéricos
      ]],
      nivelJuego: [{ value: '', disabled: true }, [Validators.required]]
    });

    this.cargarDatosIniciales();
  }

  activarEdicion(): void {
    this.modoEdicion = true;
    this.datosOriginales = { ...this.perfilForm.value }; // Guardamos los datos originales
  }

  guardarPerfil(): void {
    if (this.perfilForm.valid) {
      console.log('Perfil actualizado con éxito:', this.perfilForm.value);
      this.modoEdicion = false;
    } else {
      this.perfilForm.markAllAsTouched();
    }
  }

  cancelarEdicion(): void {
    this.perfilForm.patchValue(this.datosOriginales); // Restauramos los valores originales
    this.modoEdicion = false;
  }

  cargarDatosIniciales(): void {
    // Simulación de carga de datos del usuario
    const datosUsuario = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@example.com',
      telefono: '123456789',
      codigoArea: '11',
      nivelJuego: 'Segunda'
    };

    this.perfilForm.patchValue(datosUsuario);
  }
}
