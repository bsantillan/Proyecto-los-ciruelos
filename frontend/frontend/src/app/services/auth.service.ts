import { Injectable, inject } from '@angular/core';
import {
  Auth,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
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
    );
  }

  loginWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    );
  }

  async signInWithGoogleProvider(): Promise<any> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error) {
      console.error('Error during sign-in with Google:', error);
      throw error;
    }
  }

  async getToken(): Promise<string> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        return await user.getIdToken();
      } catch (error) {
        console.error('Error getting token:', error);
        throw new Error('Failed to get token');
      }
    } else {
      throw new Error('No user is logged in');
    }
  }

  getRoleBasedOnEmail(): string {
    const user = this.auth.currentUser;
    if (user && user.email) {
      if (user.email.endsWith('@jugador.com.ar')) {
        return 'jugador';
      } else if (user.email.endsWith('@empleado.com')) {
        return 'empleado';
      } else {
        return 'desconocido';
      }
    }
    return 'desconocido';
  }


  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const user = this.auth.currentUser;
      if (user) {
        resolve(user);
      } else {
        reject('No hay un usuario autenticado');
      }
    });
  }
  


  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }
}
