import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'; // Importar FormArray
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-postregister',
  templateUrl: './postregister.component.html',
  styleUrls: ['./postregister.component.scss'],
})
export class PostRegisterComponent implements OnInit {
  form: FormGroup;
  playerCategories = [
    'Principiante', 'Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta', 'Sexta', 'Séptima'
  ];
  maxPhones = 3; 
  errorMessages: string[] = [];

  constructor(private formBuilder: FormBuilder, private router: Router) {
    // Inicialización del formulario
    this.form = this.formBuilder.group({
      phones: this.formBuilder.array([ 
        this.formBuilder.control('', {
          validators: [Validators.required, Validators.pattern(/^\d{6,15}$/)],
          nonNullable: true,
        }),
      ]),
      playerCategory: this.formBuilder.control('', {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  ngOnInit(): void {}

  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  submit(): void {
    if (this.form.invalid) {
      this.errorMessages = this.getFormErrors(); 
      console.log(this.errorMessages); 
      return;
    }

    const phones = this.phones.value; 
    const playerCategory = this.form.get('playerCategory')?.value;

    console.log('Datos del postregistro:', { phones, playerCategory });
    alert('Datos guardados correctamente.');
    this.router.navigate(['/login']);
  }

  addPhone(): void {
    if (this.phones.length < this.maxPhones) {
      this.phones.push(
        this.formBuilder.control('', {
          validators: [Validators.required, Validators.pattern(/^\d{6,15}$/)],
          nonNullable: true,
        })
      );
    }
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.removeAt(index); 
    } else {
      this.phones.at(0).setValue('');
    }
  }

  getFormErrors(): string[] {
    const messages: string[] = [];
    const controls = this.form.controls;

    if (controls['playerCategory'].invalid) {
      messages.push('Seleccione una categoría de jugador.');
    }
    if (this.phones.length < 1) {
      messages.push('Debe agregar al menos un número de teléfono.');
    } else {
      this.phones.controls.forEach((control, index) => {
        if (control.invalid && control.value) { 
          messages.push(`Número de teléfono ${index + 1} inválido.`);
        }
      });
    }
    return messages;
  }


}
