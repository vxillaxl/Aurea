import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { crearCuenta, entrarConCuenta } from '../datos/aurea.datos';

@Component({
  selector: 'app-entrar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './entrar.html',
})
export class Entrar {
  modo = signal<'entrar' | 'crear'>('entrar');
  intento = signal(false);
  aviso = signal('');

  private fb = inject(FormBuilder);
  private router = inject(Router);

  entrarForm = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(4)]],
  });

  crearForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(4)]],
  });

  cambiarModo(modo: 'entrar' | 'crear') {
    this.modo.set(modo);
    this.intento.set(false);
    this.aviso.set('');
  }

  entrar() {
    this.intento.set(true);
    if (this.entrarForm.invalid) {
      this.aviso.set('');
      return;
    }
    const valor = this.entrarForm.getRawValue();
    const error = entrarConCuenta(valor.correo, valor.clave);
    if (error) {
      this.aviso.set(error);
      return;
    }
    this.router.navigateByUrl('/');
  }

  crear() {
    this.intento.set(true);
    if (this.crearForm.invalid) {
      this.aviso.set('');
      return;
    }
    const valor = this.crearForm.getRawValue();
    const error = crearCuenta(valor);
    if (error) {
      this.aviso.set(error);
      return;
    }
    this.router.navigateByUrl('/');
  }
}
