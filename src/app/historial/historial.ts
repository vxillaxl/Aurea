import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { leerCitas, leerTomas } from '../datos/aurea.datos';
import { Cita } from '../models/cita.model';
import { Toma } from '../models/toma.model';

@Component({
  selector: 'app-historial',
  imports: [CommonModule, RouterLink],
  templateUrl: './historial.html',
})
export class Historial {
  citas = signal<Cita[]>(leerCitas());
  tomas = signal<Toma[]>(leerTomas());
  filtro = signal<'todo' | 'citas' | 'tomas'>('todo');

  cambiarFiltro(valor: 'todo' | 'citas' | 'tomas') {
    this.filtro.set(valor);
  }

  citasOrdenadas(): Cita[] {
    return [...this.citas()].sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  }

  tomadas(): Toma[] {
    return this.tomas().filter((toma) => toma.tomada); // solo las que tienen la casilla marcada
  }

  diaNumero(iso: string): string {
    return String(Number(iso.split('-')[2]));
  }

  mesCorto(iso: string): string {
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return meses[Number(iso.split('-')[1]) - 1] ?? '';
  }

  setClaseEstado(estado: Cita['estado']) {
    return estado === 'confirmada' ? 'estado-ok' : 'estado-pendiente';
  }
}
