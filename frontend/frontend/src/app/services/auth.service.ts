import { Injectable, inject } from '@angular/core';
import {
  Auth,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  sendPasswordResetEmail,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
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
    ).then(async (userCredential) => {
      if (userCredential.user) {
        try {
          await sendEmailVerification(userCredential.user);
          console.log('Correo de verificación enviado a:', userCredential.user.email);
        } catch (error) {
          console.error('Error al enviar el correo de verificación:', error);
        }
      }
      return userCredential;
    }).catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.error('Error: El correo ya está en uso.');
        throw new Error('El correo ya está registrado. Por favor, inicia sesión.');
      } else {
        console.error('Error durante el registro:', error);
        throw error;
      }
    });
  }

  loginWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    ).then((userCredential) => {
      if (userCredential.user?.emailVerified) {
        return userCredential;
      } else {
        throw new Error('El correo no ha sido verificado. Revisa tu bandeja de entrada.');
      }
    }).catch(error => {
      throw error;
    });
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

  async signInWithGoogleProvider(): Promise<{ name: string; lastName: string; email: string } | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
  
      if (user) {
        const email = user.email || '';
  
        // Verifica si el correo ya está registrado
        const isRegistered = await this.isEmailRegistered(email);
        if (isRegistered) {
          console.log('El correo ya está registrado. Puedes iniciar sesión.');
          // Aquí puedes redirigir al usuario a la página de inicio de sesión, si es necesario
          return null; // O lanza un error o un mensaje
        }
  
        // No crear el usuario aún, solo devolver los datos para completar el formulario
        const fullName = user.displayName || 'Sin nombre';
        const [name, ...lastNameParts] = fullName.split(' ');
        const lastName = lastNameParts.join(' ');
  
        return { name, lastName, email };
      } else {
        throw new Error('No se pudieron obtener los datos del usuario de Google.');
      }
    } catch (error) {
      console.error('Error durante la autenticación con Google:', error);
      throw error;
    }
  }
  

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw error;
    }
  }

  async isEmailRegistered(email: string): Promise<boolean> {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
      return signInMethods.length > 0;
    } catch (error) {
      throw error;
    }
  }

  getRoleBasedOnEmail(email: string): { role: string; esProfesor?: boolean; esDueño?: boolean } {
    if (email) {
      if (email.endsWith('@jugador.com.ar')) {
        const esProfesor = email.startsWith('profesor');
        return { role: 'jugador', esProfesor };
      } else if (email.endsWith('@empleado.com')) {
        const esDueño = email.startsWith('dueño');
        return { role: 'empleado', esDueño };
      }
    }
    return { role: 'desconocido' };
  }
}
