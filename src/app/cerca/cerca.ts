import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { centros } from '../datos/aurea.datos';
import { Centro } from '../models/centro.model';

@Component({
  selector: 'app-cerca',
  imports: [CommonModule],
  templateUrl: './cerca.html',
  styleUrl: './cerca.scss',
})
export class Cerca {
  private sanitizer = inject(DomSanitizer);
  centros = signal<Centro[]>(centros); // lista fija, no va a localStorage
  filtro = signal<'todos' | 'hospital' | 'ips' | 'farmacia'>('todos');
  texto = signal('');
  elegido = signal<Centro | null>(null);
  mapa = signal<SafeResourceUrl>(this.direccionSegura(null));

  recibirBusqueda(event: Event) {
    const input = event.target as HTMLInputElement;
    this.texto.set(input.value);
  }

  cambiarFiltro(valor: 'todos' | 'hospital' | 'ips' | 'farmacia') {
    this.filtro.set(valor);
    const actual = this.elegido();
    if (actual && !this.centrosVisibles().some((centro) => centro.id === actual.id)) {
      this.elegido.set(null);
      this.mapa.set(this.direccionSegura(null));
    }
  }

  irAlMapa() {
    document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  elegir(centro: Centro) {
    const mismo = this.elegido()?.id === centro.id;
    const siguiente = mismo ? null : centro;
    this.elegido.set(siguiente);
    this.mapa.set(this.direccionSegura(siguiente));
    if (!mismo) {
      document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  enlaceExterno(): string {
    const consulta = encodeURIComponent(this.consulta(this.elegido()));
    return `https://www.google.com/maps/search/?api=1&query=${consulta}`;
  }

  private consulta(centro: Centro | null): string {
    return centro ? centro.direccion : 'Pasto, Nariño, Colombia';
  }

  private direccionSegura(centro: Centro | null): SafeResourceUrl {
    const zoom = centro ? 16 : 13;
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(this.consulta(centro))}&z=${zoom}&hl=es&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  esHospital(centro: Centro): boolean {
    return centro.tipo === 'ips' && centro.nombre.toLowerCase().includes('hospital');
  }

  // el *ngFor usa esta, ya filtrada por hospital, ips o farmacia
  centrosVisibles(): Centro[] {
    const busqueda = this.texto().trim().toLowerCase();
    const filtro = this.filtro();

    return this.centros().filter((centro) => {
      const coincideTipo =
        filtro === 'todos' ||
        (filtro === 'hospital' && this.esHospital(centro)) ||
        (filtro === 'ips' && centro.tipo === 'ips' && !this.esHospital(centro)) ||
        (filtro === 'farmacia' && centro.tipo === 'farmacia');
      const coincideTexto =
        centro.nombre.toLowerCase().includes(busqueda) ||
        centro.barrio.toLowerCase().includes(busqueda) ||
        centro.direccion.toLowerCase().includes(busqueda);
      return coincideTipo && coincideTexto;
    });
  }

  fotoDe(centro: Centro): string {
    return centro.tipo === 'farmacia' ? 'foto-farmacia.jpg' : 'foto-hospital.jpg';
  }

  etiquetaTipo(centro: Centro): string {
    if (centro.tipo === 'farmacia') {
      return 'Farmacia';
    }
    return this.esHospital(centro) ? 'Hospital' : 'IPS';
  }

  cuantos(valor: 'hospital' | 'ips' | 'farmacia'): number {
    return this.centros().filter((centro) => {
      if (valor === 'hospital') {
        return this.esHospital(centro);
      }
      if (valor === 'ips') {
        return centro.tipo === 'ips' && !this.esHospital(centro);
      }
      return centro.tipo === 'farmacia';
    }).length;
  }

  setClaseTipo(tipo: Centro['tipo']) {
    switch (tipo) {
      case 'ips':
        return 'tipo-ips';
      case 'farmacia':
        return 'tipo-farmacia';
      default:
        return 'tipo-ips';
    }
  }
}
