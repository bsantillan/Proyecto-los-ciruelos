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
import { ToastrService } from 'ngx-toastr';

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

  constructor(private fb: FormBuilder, private toastr: ToastrService) {
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
          };
          console.log('Datos del usuario:', userData);
          this.toastr.success('Registro exitoso. Verifica tu correo electrónico');
        }
        return userCredential;
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          this.toastr.error('El correo ya está registrado. Por favor, inicia sesión.');
        } else {
          this.toastr.error('Error en el registro. Intenta nuevamente.');
        }
        throw error;
      });
  }
  

  loginWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, credential.email, credential.password)
        .then(async (userCredential) => { 
            if (!userCredential.user?.emailVerified) {
                await sendEmailVerification(userCredential.user); 
                throw {
                    code: 'auth/email-not-verified',
                    message: 'No puedes iniciar sesión aún. Debes verificar tu correo electrónico. Te reenviamos el mail!'
                    
                    
                };
            }
            return userCredential;
        })
        .catch(error => {
            if (error.code === 'auth/user-not-found') {
                throw new Error('El usuario no existe.');
            }
            throw error; 
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

            this.router.navigate(['/home']);
            return user;
        }
    } catch (error) {
        console.error("Error en el inicio de sesión con Google:", error);
        alert('Hubo un problema al iniciar sesión con Google. Por favor, intenta de nuevo.');
    }

    return null;
}


async sendEmailVerification(userCredential: UserCredential): Promise<void> {
  const user = userCredential.user; 
  if (user && !user.emailVerified) {
      alert('Enviando correo de verificación...');
      await sendEmailVerification(user);
      alert('Correo de verificación enviado.');
  } else {
      alert('No se encontró al usuario o el correo ya está verificado.');
      throw new Error('No se encontró al usuario o el correo ya está verificado.');
  }
}




  async signInWithGoogleProvider(): Promise<{ name: string; lastName: string; email: string } | null> {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(this.auth, provider);
        const user = result.user;

        if (user) {
            const email = user.email || '';

            const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
            if (signInMethods.length > 0) {
                alert('Este correo ya está registrado. Por favor, inicia sesión.');
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
        console.error("Error en el inicio de sesión con Google:", error);
        alert(`Ya estas registrado, te solicitamos que inicies sesion! `);
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
