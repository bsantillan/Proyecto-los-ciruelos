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
  EmailAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { applyActionCode, getAuth, getRedirectResult, signInWithRedirect } from 'firebase/auth';


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

  constructor(private fb: FormBuilder, private toastrService: ToastrService) {
    this.form = this.fb.group({
      names: ['', Validators.required],
      lastName: ['', Validators.required],

    });

  }
  
  async updatePassword(newPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      return updatePassword(user, newPassword); 
    } else {
      throw new Error('No hay usuario autenticado');
    }
  }
  
  registerWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, credential.email, credential.password)
      .then(async (userCredential) => {
        if (userCredential.user) {
          this.enviarEmailVerification(userCredential);
          const userData = {
            uid: userCredential.user.uid,
            email: credential.email,
            role: 'jugador', 
            name: this.form.get('names')?.value,
            lastName: this.form.get('lastName')?.value,
          };
        }
        return userCredential;
      })  
      .catch(error => {
        throw error;
      });
  }
  
  async verifyEmailWithCode(oobCode: string): Promise<void> {
    const auth = getAuth();
    try {
      await applyActionCode(auth, oobCode); 
      console.log('Correo electrónico verificado');
    } catch (error) {
      console.error('Error al verificar el correo electrónico:', error);
      throw error; 
    }
  }

  loginWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, credential.email, credential.password)
      .then(async (userCredential) => {
        // Verificar si el correo está verificado
        if (!userCredential.user?.emailVerified) {
          // Enviar nuevamente el correo de verificación
          sendEmailVerification(userCredential.user);
          
          // Lanzar un error con el código 'auth/email-not-verified'
          const error: any = new Error('Correo no verificado');
          error.code = 'auth/email-not-verified'; // Definir el código de error Firebase
          throw error;
        }
        this.toastrService.success("Bienvenido de nuevo! Nos alegra verte otra vez.", "Exito");
  
        return userCredential;
      })
      .catch((error) => {
        // Dejar que FirebaseErrorService maneje el error
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
  
  async loginWithGoogleProvider(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
  
    try {
      return await signInWithPopup(this.auth, provider);
      

    } catch (error: any) {
      return error;
    }
  }  

  async enviarEmailVerification(userCredential: UserCredential): Promise<void> {
    const user = userCredential.user;
    if (user && !user.emailVerified) {
      try {
        const actionCodeSettings = {
          url: 'https://proyecto-los-ciruelos.firebaseapp.com/__/auth/action',  
          handleCodeInApp: true,
        };
      
        await sendEmailVerification(user, actionCodeSettings);
        this.toastrService.info("Correo de verificación enviado. Revisa tu correo electronico.", "Verificación requerida");
      } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        this.toastrService.error("Error al enviar el correo de verificación. Inténtalo nuevamente.", "Error");
      }
    } else {
      this.toastrService.warning("No pudimos encontrar tu cuenta o ya verificaste tu correo.", "Atención");
    }
  }

  async signInWithGoogleProvider(): Promise<{ name: string; lastName: string; email: string } | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      if (user) {
        const email = user.email || '';

        // Verificamos si el correo ya está registrado
        const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
        if (signInMethods.length > 0) {
          // Si el correo está registrado, mostramos un mensaje y no continuamos
          alert('Este correo ya está registrado. Por favor, inicia sesión.');
          this.router.navigate(['/login']); // Navegamos a la página de inicio de sesión
          return null; // Devolvemos null para que no continúe el registro
        }

        // Si no está registrado, mandamos correo de verificación
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
      alert('Hubo un error al iniciar sesión con Google. Por favor, intenta de nuevo.');
      return null; // Devolvemos null en caso de error
    }
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  /*getRoleBasedOnEmail(email: string): { role: string; esProfesor?: boolean; esDueño?: boolean } {
    if (email) {
      if (email.endsWith('@jugador.com.ar')) {
        return { role: 'jugador', esProfesor: email.startsWith('profesor') };
      } else if (email.endsWith('@empleado.com')) {
        return { role: 'empleado', esDueño: email.startsWith('dueño') };
      }
    }
    return { role: 'desconocido' };
  }*/
}
