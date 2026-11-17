import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fechaDeHoy, formatearFecha as textoFecha, guardarTomas, leerCitas, leerTomas } from '../datos/aurea.datos';
import { Cita } from '../models/cita.model';
import { Toma } from '../models/toma.model';

@Component({
  selector: 'app-hoy',
  imports: [CommonModule, RouterLink],
  templateUrl: './hoy.html',
  styleUrl: './hoy.scss',
})
export class Hoy {
  citas = signal<Cita[]>(leerCitas());
  tomas = signal<Toma[]>(leerTomas());
  fechaHoy = fechaDeHoy();
  atento = false;
  inclinacion = { x: 0, y: 0 };

  citasDeHoy(): Cita[] {
    return this.citas()
      .filter((cita) => cita.fecha === this.fechaHoy)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  proximaCita(): Cita | undefined {
    // la primera de hoy. si hoy no hay, la que sigue
    const deHoy = this.citasDeHoy()[0];
    if (deHoy) {
      return deHoy;
    }
    return this.citas()
      .filter((cita) => cita.fecha >= this.fechaHoy)
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))[0];
  }

  otrasCitasHoy(): Cita[] {
    return this.citasDeHoy().slice(1);
  }

  // las que siguen después de la próxima, para llenar Inicio
  otrasProximas(): Cita[] {
    const proxima = this.proximaCita();
    return this.citas()
      .filter((cita) => cita.fecha >= this.fechaHoy && (!proxima || cita.id !== proxima.id))
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
      .slice(0, 4);
  }

  tomasOrdenadas(): Toma[] {
    return [...this.tomas()].sort((a, b) => {
      if (a.tomada !== b.tomada) {
        return a.tomada ? 1 : -1;
      }
      return a.hora.localeCompare(b.hora);
    });
  }

  tomasPendientes(): number {
    return this.tomas().filter((toma) => !toma.tomada).length;
  }

  tomasHechas(): number {
    return this.tomas().filter((toma) => toma.tomada).length;
  }

  citasProximasTotal(): number {
    return this.citas().filter((cita) => cita.fecha >= this.fechaHoy).length;
  }

  fechaLegible(): string {
    return textoFecha(this.fechaHoy);
  }

  fechaHero(): string {
    return this.fechaLegible().replace(/[a-záéíóúñ]+/i, (mes) => mes.toUpperCase());
  }

  fechaLarga(iso: string = this.fechaHoy): string {
    const [anio, mes, dia] = iso.split('-').map(Number);
    const texto = new Date(anio, mes - 1, dia).toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
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

  mostrarFecha(iso: string): string {
    return textoFecha(iso);
  }

  setClaseEstado(estado: Cita['estado']) {
    switch (estado) {
      case 'confirmada':
        return 'estado-ok';
      case 'pendiente':
        return 'estado-pendiente';
      default:
        return 'estado-pendiente';
    }
  }

  setClaseMomento(momento: Toma['momento']) {
    switch (momento) {
      case 'manana':
        return 'momento-manana';
      case 'tarde':
        return 'momento-tarde';
      case 'noche':
        return 'momento-noche';
      default:
        return 'momento-tarde';
    }
  }

  etiquetaMomento(momento: Toma['momento']) {
    switch (momento) {
      case 'manana':
        return 'En la mañana';
      case 'tarde':
        return 'En la tarde';
      case 'noche':
        return 'En la noche';
      default:
        return momento;
    }
  }

  moverTarjeta(event: MouseEvent) {
    const el = event.currentTarget as HTMLElement;
    const caja = el.getBoundingClientRect();
    const px = (event.clientX - caja.left) / caja.width - 0.5;
    const py = (event.clientY - caja.top) / caja.height - 0.5;
    this.inclinacion = { x: py * -7, y: px * 9 };
    this.atento = true;
  }

  soltarTarjeta() {
    this.inclinacion = { x: 0, y: 0 };
    this.atento = false;
  }

  onChangeTomada(event: Event, toma: Toma) {
    // evento change de la casilla. solo asi pasa a tomada
    const checkbox = event.target as HTMLInputElement;
    const tomada = checkbox.checked;

    this.tomas.update((lista) =>
      lista.map((item) => (item.id === toma.id ? { ...item, tomada } : item)),
    );
    guardarTomas(this.tomas());
  }
}
