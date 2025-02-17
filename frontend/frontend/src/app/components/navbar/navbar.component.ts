import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUrl: string = '';
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;  // Variable para controlar el rol del usuario

  constructor(private router: Router, private authService: AuthService, private toastrService: ToastrService) {
    // Verificamos si el usuario está logueado
    this.authService.authState$.subscribe(user => {
      this.isLoggedIn = !!user; // Si hay un usuario, isLoggedIn es true
      if (user) {
        // Si está logueado, obtenemos el rol
        this.authService.getUserRole().subscribe(role => {
          this.isAdmin = role === 'admin';  // Si el rol es admin, se asigna true
        });
      } else {
        this.isAdmin = false;  // Si no está logueado, no es admin
      }
    });
  }

  ngOnInit() {
    // Detecta cambios en la URL
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  navigateOrScroll(sectionId: string) {
    if (this.currentUrl !== '/') {
      // Si no está en el home, redirigir primero al home
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToSection(sectionId), 100); // Espera a que cargue el home
      });
    } else {
      // Si ya está en el home, hacer scroll directo
      this.scrollToSection(sectionId);
    }
  }

  // Método para manejar el logout
  logout(): void {
    this.authService.logout();
    this.toastrService.success('Has cerrado sesión correctamente', 'Logout');
  }

  private scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
