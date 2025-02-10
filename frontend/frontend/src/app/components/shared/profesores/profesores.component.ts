import { Component } from '@angular/core';
import { ProfesoresService } from '../../../services/profesores.service';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})
export class ProfesoresComponent {
  profesores: any[] = [];
  profesoresFiltrados: any[] = [];
  searchText: string = '';
  categorias = ["Todas", "Primera", "Segunda", "Tercera", "Cuarta", "Quinta", "Sexta", "Séptima", "Principiante"];
  categoriaSeleccionada: string = '';

  constructor(private profesorService: ProfesoresService  ) {}

  ngOnInit(): void { this.obtenerProfesores(); }
  obtenerProfesores(): void {
    this.profesorService.getProfesores().subscribe(data => {
      this.profesores = data;
      this.profesoresFiltrados = data; // Inicialmente, todos los profesores se muestran
    });
  }

  filtrarProfesores(): void {
    this.profesoresFiltrados = this.profesores.filter(profesor =>
      profesor.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
      profesor.especialidad.toLowerCase().includes(this.searchText.toLowerCase())
    );

    if (this.categoriaSeleccionada) {
      this.profesoresFiltrados = this.profesoresFiltrados.filter(
        profesor => profesor.especialidad === this.categoriaSeleccionada
      );
    }
  }
  
  filtrarPorCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.filtrarProfesores();
}

  // filtro: string = '';
  // categoriaSeleccionada: string = 'Todos';

  // categorias = ['Todos', 'Principiante', 'Intermedio', 'Avanzado', 'Profesional'];

  // profesores = [
  //   { nombre: 'Carlos', apellido: 'Rodríguez', especialidad: 'Principiante', email: 'carlos@example.com', contacto: '+54 11 1234-5678' },
  //   { nombre: 'Ana', apellido: 'Martínez', especialidad: 'Intermedio', email: 'ana@example.com', contacto: '+54 11 8765-4321' },
  //   { nombre: 'Javier', apellido: 'Gómez', especialidad: 'Avanzado', email: 'javier@example.com', contacto: '+54 9 351 987-6543' },
  //   { nombre: 'Laura', apellido: 'Fernández', especialidad: 'Profesional', email: 'laura@example.com', contacto: '+54 9 354 777-8888' },
  //   { nombre: 'Diego', apellido: 'Pérez', especialidad: 'Intermedio', email: 'diego@example.com', contacto: '+54 9 356 222-9999' }
  // ];

  // profesorSeleccionado: any = null;

  // get profesoresFiltrados() {
  //   return this.profesores.filter(profesor =>
  //     (this.categoriaSeleccionada === 'Todos' || profesor.especialidad === this.categoriaSeleccionada) &&
  //     (`${profesor.nombre} ${profesor.apellido}`.toLowerCase().includes(this.filtro.toLowerCase()))
  //   );
  // }

  // filtrarPorCategoria(categoria: string) {
  //   this.categoriaSeleccionada = categoria;
  // }

  // verDetalles(profesor: any) {
  //   this.profesorSeleccionado = profesor;
  // }

  // cerrarDetalles() {
  //   this.profesorSeleccionado = null;
  // }
}
