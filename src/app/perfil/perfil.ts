import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  cerrarSesion,
  formatearFecha as textoFecha,
  guardarPerfil,
  leerCitas,
  leerTomas,
  perfilActual,
  sesionActual,
} from '../datos/aurea.datos';
import { Cita } from '../models/cita.model';
import { Toma } from '../models/toma.model';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
})
export class Perfil {
  perfil = perfilActual;
  sesion = sesionActual;
  citas = signal<Cita[]>(leerCitas());
  tomas = signal<Toma[]>(leerTomas());
  intento = signal(false);
  aviso = signal('');

  private fb = inject(FormBuilder);
  private router = inject(Router);

  perfilForm = this.fb.nonNullable.group({
    nombre: [this.perfil().nombre, [Validators.required, Validators.minLength(2), Validators.maxLength(24)]],
    apellido: [this.perfil().apellido, [Validators.required, Validators.minLength(2), Validators.maxLength(24)]],
  });

  pendientes(): number {
    return this.tomas().filter((toma) => !toma.tomada).length;
  }

  tomadas(): number {
    return this.tomas().filter((toma) => toma.tomada).length;
  }

  confirmadas(): number {
    return this.citas().filter((cita) => cita.estado === 'confirmada').length;
  }

  proximas(): number {
    const hoy = this.fechaDeHoy();
    return this.citas().filter((cita) => cita.fecha >= hoy).length;
  }

  proximaCita(): Cita | null {
    const hoy = this.fechaDeHoy();
    return (
      this.citas()
        .filter((cita) => cita.fecha >= hoy)
        .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))[0] ?? null
    );
  }

  citasCercanas(): Cita[] {
    const hoy = this.fechaDeHoy();
    return this.citas()
      .filter((cita) => cita.fecha >= hoy)
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
      .slice(0, 5);
  }

  dosisPendientes(): Toma[] {
    return this.tomas()
      .filter((toma) => !toma.tomada)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  iniciales(): string {
    const nombre = this.perfil().nombre.trim();
    const apellido = this.perfil().apellido.trim();
    return (nombre.charAt(0) + apellido.charAt(0)).toUpperCase();
  }

  mostrarFecha(iso: string): string {
    return textoFecha(iso);
  }

  horaLinda(hora: string): string {
    const [horas, minutos] = hora.split(':');
    const numero = Number(horas);
    if (Number.isNaN(numero)) {
      return hora;
    }
    const sufijo = numero < 12 ? 'a. m.' : 'p. m.';
    const enDoce = numero % 12 === 0 ? 12 : numero % 12;
    return `${String(enDoce).padStart(2, '0')}:${minutos ?? '00'} ${sufijo}`;
  }

  setClaseEstado(estado: Cita['estado']) {
    return estado === 'confirmada' ? 'estado-ok' : 'estado-pendiente';
  }

  guardar() {
    this.intento.set(true);

    if (this.perfilForm.invalid) {
      this.aviso.set('');
      return;
    }

    const valor = this.perfilForm.getRawValue();
    guardarPerfil({
      nombre: this.nombrePropio(valor.nombre),
      apellido: this.nombrePropio(valor.apellido),
    });
    this.perfilForm.patchValue(this.perfil());
    this.intento.set(false);
    this.aviso.set('Listo. El saludo de arriba ya usa este nombre.');
  }

  salir() {
    cerrarSesion();
    this.router.navigateByUrl('/entrar');
  }

  private fechaDeHoy(): string {
    const ahora = new Date();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    return `${ahora.getFullYear()}-${mes}-${dia}`;
  }

  private nombrePropio(texto: string): string {
    const limpio = texto.trim().replace(/\s+/g, ' ');
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
  }
}
