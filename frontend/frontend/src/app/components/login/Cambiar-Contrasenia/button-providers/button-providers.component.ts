import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

export type Provider = 'google';

@Component({
  selector: 'app-button-providers',
  templateUrl: './button-providers.component.html',
  styleUrls: ['./button-providers.component.scss'],
})
export class ButtonProviders {
  @Input() isLogin = false;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {}

  providerAction(provider: Provider): void {
    if (provider === 'google') {
      this.signUpWithGoogle();
    }
  }

  async signUpWithGoogle(): Promise<void> {
    try {
      const result = await this._authService.signInWithGoogleProvider();
      this._router.navigate(['/home']); // Cambiar la ruta de redirección según el flujo deseado
      console.log(result);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  }
}