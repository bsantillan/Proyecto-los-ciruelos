import { Component } from '@angular/core';
import { ApiService } from '../../../api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'consultar-usuarios',
  templateUrl: './consultar_usuarios.component.html',
  styleUrls: ['./consultar_usuarios.component.css']
})

export class ConsultarUsuariosComponent {
  usuarioActual: any;
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];

  filtro = {
    categoria: '',
    email: '',
    nombre: '',
    apellido: ''
  };

  categorias: string[] = ["Jugador", "Profesor", "Socio"];

  constructor(
    private authService: AuthService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    // Verificar si el usuario es un administrador antes de hacer la solicitud
    this.authService.getUserRole().subscribe(role => {
      if (role === 'admin') {
        this.api.getUsuarios().subscribe((usuarios) => {
          this.usuarios = usuarios;
          this.usuariosFiltrados = usuarios;
        });
      } else {
        console.error("Acceso denegado: Solo el administrador puede ver los usuarios.");
      }
    });
  }

  eliminarUsuario(usuarioId: number): void {
    if (confirm("¿Está seguro de eliminar este usuario?")) {
      this.api.eliminarUsuario(usuarioId).subscribe((resultado) => {
        console.log("Usuario eliminado:", resultado);
        this.obtenerUsuarios();
      });
    }
  }

  filtrarUsuarios(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      return (
        (!this.filtro.categoria || usuario.categoria === this.filtro.categoria) &&
        (!this.filtro.email || usuario.email.toLowerCase().includes(this.filtro.email.toLowerCase())) &&
        (!this.filtro.nombre || usuario.nombre.toLowerCase().includes(this.filtro.nombre.toLowerCase())) &&
        (!this.filtro.apellido || usuario.apellido.toLowerCase().includes(this.filtro.apellido.toLowerCase()))
      );
    });
  }

  seleccionarCategoria(categoria: string): void {
    this.filtro.categoria = this.filtro.categoria === categoria ? '' : categoria;
    this.filtrarUsuarios();
  }
}
