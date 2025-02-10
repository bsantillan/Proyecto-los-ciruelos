import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  modoEdicion: boolean = false; // Variable para activar/desactivar edición

  constructor(private fb: FormBuilder) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(25)]],
      apellido: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      telefono: ['', Validators.required],
      codigoArea: ['', Validators.required],
      nivelJuego: ['', [Validators.required, Validators.pattern('^(Primera|Segunda|Tercera|Cuarta|Quinta|Sexta|Séptima|Principiante)$')]]
    });
  }

  ngOnInit(): void {
    // Aquí podrías cargar los datos del usuario desde el backend
    
  }

  toggleEdicion(): void {
    if (this.modoEdicion) {
      // Aquí podrías enviar los datos actualizados al backend
      console.log('Datos actualizados:', this.perfilForm.value);
    }
    this.modoEdicion = !this.modoEdicion;
  }
}
