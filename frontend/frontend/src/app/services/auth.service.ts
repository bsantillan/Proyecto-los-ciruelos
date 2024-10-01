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
      console.log('Usuario registrado:', userCredential);
      return userCredential;
    }).catch(error => {
      console.error('Error durante el registro:', error);
      throw error;
    });
  }

  loginWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    ).then((userCredential) => {
      console.log('Usuario logueado:', userCredential);
      return userCredential;
    }).catch(error => {
      console.error('Error durante el inicio de sesión:', error);
      throw error;
    });
  }

  async signInWithGoogleProvider(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
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

  getRoleBasedOnEmail(email: string): { role: string; esProfesor?: boolean; esDueño?: boolean } {
    if (email) {
        // Rol Jugador con booleano esProfesor
        if (email.endsWith('@jugador.com.ar')) {
            const esProfesor = email.startsWith('profesor');
            return { role: 'jugador', esProfesor };
        }
        // Rol Empleado con booleano esDueño
        else if (email.endsWith('@empleado.com')) {
            const esDueño = email.startsWith('dueño');
            return { role: 'empleado', esDueño };
        }
        // Rol Administrador
        else if (email.endsWith('@admin.com')) {
            return { role: 'administrador' };
        }
    }
    return { role: 'desconocido' };
  }
}
