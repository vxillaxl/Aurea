import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatearFecha as textoFecha, guardarCitas, leerCitas } from '../datos/aurea.datos';
import { Cita } from '../models/cita.model';

@Component({
  selector: 'app-citas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './citas.html',
  styleUrl: './citas.scss',
})
export class Citas {
  citas = signal<Cita[]>(leerCitas()); // lista. al cambiar, la pantalla se actualiza
  filtro = signal<'todas' | 'hoy' | 'proximas'>('todas');
  texto = signal('');
  intento = signal(false); // true cuando ya oprimí guardar
  aviso = signal('');
  editando = signal<number | null>(null);
  atento = false;

  private fb = inject(FormBuilder);

  // formulario reactivo: todos obligatorios, especialidad minimo 3 letras
  citaForm = this.fb.nonNullable.group({
    especialidad: ['', [Validators.required, Validators.minLength(3)]],
    ips: ['', Validators.required],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
  });

  // la lista que pinta el *ngFor, ya filtrada
  citasVisibles(): Cita[] {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const filtro = this.filtro();

    const busqueda = this.texto().trim().toLowerCase();

    return this.citas()
      .filter((cita) => {
        const fecha = new Date(cita.fecha + 'T12:00:00');
        const coincideTexto =
          cita.especialidad.toLowerCase().includes(busqueda) || cita.ips.toLowerCase().includes(busqueda);
        if (!coincideTexto) {
          return false;
        }
        if (filtro === 'hoy') {
          return cita.fecha === this.fechaDeHoy();
        }
        if (filtro === 'proximas') {
          return fecha >= hoy;
        }
        return true;
      })
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  }

  irAlFormulario() {
    document.getElementById('nueva-cita')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  cambiarFiltro(valor: 'todas' | 'hoy' | 'proximas') {
    this.filtro.set(valor);
  }

  recibirBusqueda(event: Event) {
    this.texto.set((event.target as HTMLInputElement).value);
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

  fechaDeHoy(): string {
    const ahora = new Date();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    return `${ahora.getFullYear()}-${mes}-${dia}`;
  }

  mostrarFecha(iso: string): string {
    return textoFecha(iso);
  }

  diaNumero(iso: string): string {
    return String(Number(iso.split('-')[2]));
  }

  mesCorto(iso: string): string {
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return meses[Number(iso.split('-')[1]) - 1] ?? '';
  }

  mirarLista(activo: boolean) {
    this.atento = activo;
  }

  // clase del badge para el ngClass
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

  guardarCita() {
    this.intento.set(true);

    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      this.aviso.set('');
      return; // falta algo, no la agrego
    }

    const valor = this.citaForm.getRawValue();
    const id = this.editando();

    if (id !== null) {
      this.citas.update((lista) =>
        lista.map((item) =>
          item.id === id
            ? {
                ...item,
                especialidad: valor.especialidad.trim(),
                ips: valor.ips.trim(),
                fecha: valor.fecha,
                hora: valor.hora,
              }
            : item,
        ),
      );
      this.aviso.set('Listo. La cita quedó actualizada.');
    } else {
      const nueva: Cita = {
        id: Date.now(),
        especialidad: valor.especialidad.trim(),
        ips: valor.ips.trim(),
        fecha: valor.fecha,
        hora: valor.hora,
        estado: 'pendiente',
      };
      this.citas.update((lista) => [...lista, nueva]); // la meto al arreglo
      this.aviso.set('Listo. La cita quedó guardada en tu lista.');
    }

    guardarCitas(this.citas()); // y queda en localStorage
    this.editando.set(null);
    this.citaForm.reset();
    this.intento.set(false);
  }

  editarCita(cita: Cita) {
    this.editando.set(cita.id);
    this.intento.set(false);
    this.aviso.set('');
    this.citaForm.setValue({
      especialidad: cita.especialidad,
      ips: cita.ips,
      fecha: cita.fecha,
      hora: cita.hora,
    });
  }

  cancelarEdicion() {
    this.editando.set(null);
    this.intento.set(false);
    this.citaForm.reset();
  }

  cambiarEstado(cita: Cita) {
    const estado = cita.estado === 'confirmada' ? 'pendiente' : 'confirmada';
    this.citas.update((lista) => lista.map((item) => (item.id === cita.id ? { ...item, estado } : item)));
    guardarCitas(this.citas());
  }

  eliminarCita(cita: Cita) {
    // saco esa y vuelvo a guardar
    this.citas.update((lista) => lista.filter((item) => item.id !== cita.id));
    guardarCitas(this.citas());
    this.aviso.set('La cita se quitó de la lista.');
  }
}
