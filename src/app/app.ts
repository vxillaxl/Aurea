import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { citasActuales, fechaDeHoy, guardarTomas, leerSesion, perfilActual, sesionActual, tomasActuales } from './datos/aurea.datos';
import { Cita } from './models/cita.model';
import { Toma } from './models/toma.model';

interface AvisoPantalla {
  clave: string;
  tipo: 'toma' | 'cita';
  titulo: string;
  detalle: string;
  hora: string;
  etiqueta: string;
  toma?: Toma;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  private router = inject(Router);
  private reloj = 0;
  esHoy = signal(true);
  perfil = perfilActual;
  sesion = sesionActual;
  tomas = tomasActuales;
  citas = citasActuales;
  ahora = signal(new Date());
  avisosAbiertos = signal(false);
  ocultos = signal<string[]>([]);

  constructor() {
    sesionActual.set(leerSesion());
    const sesion = sesionActual();
    if (sesion) {
      perfilActual.set({ nombre: sesion.nombre, apellido: sesion.apellido });
    }
    this.mirarRuta();
    this.reloj = window.setInterval(() => this.ahora.set(new Date()), 20000);
    this.router.events.pipe(filter((evento) => evento instanceof NavigationEnd)).subscribe(() => {
      this.mirarRuta();
      this.avisosAbiertos.set(false);
    });
  }

  ngOnDestroy() {
    window.clearInterval(this.reloj);
  }

  porTomar(): Toma[] {
    return this.tomas()
      .filter((toma) => !toma.tomada)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  avisosEnPantalla(): AvisoPantalla[] {
    const ahora = this.ahora();
    const minutos = ahora.getHours() * 60 + ahora.getMinutes();
    const hoy = fechaDeHoy();
    const manana = this.fechaManana();
    const ocultos = this.ocultos();
    const avisos: AvisoPantalla[] = [];

    for (const toma of this.porTomar()) {
      const clave = `toma-${toma.id}`;
      if (ocultos.includes(clave) || this.minutos(toma.hora) > minutos) {
        continue;
      }
      avisos.push({
        clave,
        tipo: 'toma',
        titulo: toma.medicamento,
        detalle: `${toma.dosis} · ya es la hora`,
        hora: toma.hora,
        etiqueta: 'Hora del medicamento',
        toma,
      });
    }

    // un día antes: avisa toda la jornada
    for (const cita of this.citasDeDia(manana)) {
      const clave = `cita-antes-${cita.id}`;
      if (ocultos.includes(clave)) {
        continue;
      }
      avisos.push({
        clave,
        tipo: 'cita',
        titulo: cita.especialidad,
        detalle: `${cita.ips} · mañana`,
        hora: cita.hora,
        etiqueta: 'Mañana tienes cita',
      });
    }

    // el mismo día: desde 30 min antes hasta 2 horas después
    for (const cita of this.citasDeDia(hoy)) {
      const clave = `cita-${cita.id}`;
      const falta = this.minutos(cita.hora) - minutos;
      if (ocultos.includes(clave) || falta > 30 || falta < -120) {
        continue;
      }
      avisos.push({
        clave,
        tipo: 'cita',
        titulo: cita.especialidad,
        detalle: falta > 0 ? `${cita.ips} · en ${falta} min` : `${cita.ips} · es ahora`,
        hora: cita.hora,
        etiqueta: 'Hora de la cita',
      });
    }

    return avisos.slice(0, 3);
  }

  ocultarAviso(clave: string) {
    this.ocultos.update((lista) => [...lista, clave]);
  }

  marcarDesdeAviso(toma: Toma) {
    const lista = this.tomas().map((item) => (item.id === toma.id ? { ...item, tomada: true } : item));
    guardarTomas(lista);
    this.ocultarAviso(`toma-${toma.id}`);
  }

  iniciales(): string {
    const nombre = this.perfil().nombre.trim();
    const apellido = this.perfil().apellido.trim();
    return (nombre.charAt(0) + apellido.charAt(0)).toUpperCase();
  }

  private citasDeDia(dia: string): Cita[] {
    return this.citas()
      .filter((cita) => cita.fecha === dia)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  private fechaManana(): string {
    const fecha = new Date();
    fecha.setHours(12, 0, 0, 0);
    fecha.setDate(fecha.getDate() + 1);
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }

  private minutos(hora: string): number {
    const [horas, mins] = hora.split(':').map(Number);
    if (Number.isNaN(horas) || Number.isNaN(mins)) {
      return 24 * 60;
    }
    return horas * 60 + mins;
  }

  private mirarRuta() {
    const ruta = this.router.url.split('?')[0];
    this.esHoy.set(ruta === '/' || ruta === '');
  }
}
