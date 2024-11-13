import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verificar-correo',
  templateUrl: './verificar-correo.component.html',
  styleUrls: ['./verificar-correo.component.scss']
})
export class VerificarCorreoComponent implements OnInit {

  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute // 
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const oobCode = params['oobCode'];
      if (oobCode) {
  
        this.authService.checkEmailVerification().then(isVerified => {
          if (isVerified) {
            this.router.navigate(['/login']); 
          } else {
            alert('Por favor, verifica tu correo electrónico.');
          }
        });
      } else {
        alert('Código de verificación no encontrado en la URL.');
      }
    });
  }
  

  goToHome(): void {
    this.router.navigate(['/login']);  
  }
}
