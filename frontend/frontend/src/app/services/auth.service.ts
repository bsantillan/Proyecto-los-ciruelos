import { Injectable, inject } from '@angular/core';
import {
  Auth,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface Credential {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  readonly authState$: Observable<User | null> = authState(this.auth);

  registerWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    ).then((userCredential) => {
      const role = this.getRoleBasedOnEmail();
      console.log('Rol del usuario registrado:', role);
      // Manejar el rol del usuario registrado aquí si es necesario
      return userCredential;
    });
  }

  loginWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    ).then((userCredential) => {
      const role = this.getRoleBasedOnEmail();
      console.log('Rol del usuario logueado:', role);
      // Manejar el rol del usuario logueado aquí si es necesario
      return userCredential;
    });
  }

  async signInWithGoogleProvider(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      // Aquí puedes manejar el resultado o realizar cualquier acción adicional
      return result as UserCredential;
    } catch (error) {
      console.error('Error durante el inicio de sesión con Google:', error);
      throw error;
    }
  }

  async getToken(): Promise<string> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        return await user.getIdToken();
      } catch (error) {
        console.error('Error al obtener el token:', error);
        throw new Error('No se pudo obtener el token');
      }
    } else {
      throw new Error('No hay usuario conectado');
    }
  }

  getRoleBasedOnEmail(): string {
    const user = this.auth.currentUser;
    if (user?.email) {
      if (user.email.endsWith('@jugador.com.ar')) {
        return 'jugador';
      } else if (user.email.endsWith('@empleado.com')) {
        return 'empleado';
      }
    }
    return 'desconocido';
  }
}
