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
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


export interface Credential {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  readonly authState$: Observable<User | null> = authState(this.auth);

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      names: ['', Validators.required],
      lastName: ['', Validators.required],

    });
  }
  
  registerWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, credential.email, credential.password)
      .then(async (userCredential) => {
        if (userCredential.user) {
          await sendEmailVerification(userCredential.user);
        
          const userData = {
            uid: userCredential.user.uid,
            email: credential.email,
            role: 'jugador', 
            name: this.form.get('names')?.value,
            lastName: this.form.get('lastName')?.value,
            phones: this.form.get('phoneNumbers')?.value, 
            playerCategory: this.form.get('categoria')?.value 
          };
          console.log('Datos del usuario:', userData); 
  //        return this.http.post('https://your-backend-endpoint.com/register', userData).toPromise();
        }
        return userCredential;
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          throw new Error('El correo ya está registrado. Por favor, inicia sesión.');
        }
        throw error;
      });
  }

  loginWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, credential.email, credential.password)
      .then((userCredential) => {
        if (!userCredential.user?.emailVerified) {
          throw new Error('El correo no ha sido verificado. Revisa tu bandeja de entrada.');
        }
        return userCredential;
      });
  }

  async getToken(): Promise<string> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    throw new Error('No hay usuario conectado');
  }

  async loginWithGoogleProvider(): Promise<User | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
  
      if (user) {
        const email = user.email || '';
        if (!user.emailVerified) {
          alert('El correo electrónico no ha sido verificado. Por favor, revisa tu bandeja de entrada.');
          return null; 
        }

        this.router.navigate(['/home']);
        return user;
      }
      return null; 
    } catch (error: any) {
      alert(`Error al iniciar sesión: ${error.message}`);
      throw error;
    }
  }
  
  
  async isEmailVerified(): Promise<boolean> {
    const user = this.auth.currentUser;
    return user?.emailVerified || false;
  }

  async signInWithGoogleProvider(): Promise<{ name: string; lastName: string; email: string } | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      if (user) {
        const email = user.email || '';
        if (await this.isEmailRegistered(email)) {
          throw new Error('Este correo ya está registrado. Por favor, inicia sesión.');
        }
        await sendEmailVerification(user);
        const [name, ...lastNameParts] = (user.displayName || 'Sin nombre').split(' ');
        const lastName = lastNameParts.join(' ');
        alert('Registro exitoso. Verifica tu correo electrónico para completar la validación.');
        this.router.navigate(['/postregister']);
        return { name, lastName, email };
      }
      throw new Error('No se pudieron obtener los datos del usuario de Google.');
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async isEmailRegistered(email: string): Promise<boolean> {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);

      return signInMethods.length > 0;
    }catch (error: any) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/too-many-requests') {
        return true; 
      }
      if (error.code === 'auth/user-not-found') {
        return false; 
      }

      console.error('Error al intentar iniciar sesión:', error);
      throw error; 
    }
  }
  

  getRoleBasedOnEmail(email: string): { role: string; esProfesor?: boolean; esDueño?: boolean } {
    if (email) {
      if (email.endsWith('@jugador.com.ar')) {
        return { role: 'jugador', esProfesor: email.startsWith('profesor') };
      } else if (email.endsWith('@empleado.com')) {
        return { role: 'empleado', esDueño: email.startsWith('dueño') };
      }
    }
    return { role: 'desconocido' };
  }
}
