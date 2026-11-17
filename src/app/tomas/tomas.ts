import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { guardarTomas, leerTomas } from '../datos/aurea.datos';
import { Toma } from '../models/toma.model';

@Component({
  selector: 'app-tomas',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './tomas.html',
  styleUrl: './tomas.scss',
})
export class Tomas {
  tomas = signal<Toma[]>(leerTomas());
  filtro = signal<'todas' | 'pendientes' | 'tomadas'>('todas'); // lo leen los botones con filtro()
  texto = signal('');
  intento = signal(false);
  aviso = signal('');
  editando = signal<number | null>(null);
  gesto = signal(false);
  private gestoTimer = 0;

  private fb = inject(FormBuilder);

  // mismo formulario reactivo: nombre, dosis, hora y momento
  tomaForm = this.fb.nonNullable.group({
    medicamento: ['', [Validators.required, Validators.minLength(3)]],
    dosis: ['', Validators.required],
    hora: ['', Validators.required],
    momento: ['manana' as Toma['momento'], Validators.required],
  });

  tomasVisibles(): Toma[] {
    const filtro = this.filtro();
    const busqueda = this.texto().trim().toLowerCase();
    return this.tomas()
      .filter((toma) => {
        if (!toma.medicamento.toLowerCase().includes(busqueda)) {
          return false;
        }
        if (filtro === 'pendientes') {
          return !toma.tomada;
        }
        if (filtro === 'tomadas') {
          return toma.tomada;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.tomada !== b.tomada) {
          return a.tomada ? 1 : -1;
        }
        return a.hora.localeCompare(b.hora);
      });
  }

  irAlFormulario() {
    document.getElementById('nuevo-medicamento')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  cambiarFiltro(valor: 'todas' | 'pendientes' | 'tomadas') {
    this.filtro.set(valor);
  }

  recibirBusqueda(event: Event) {
    this.texto.set((event.target as HTMLInputElement).value);
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

  cuantas(valor: 'todas' | 'pendientes' | 'tomadas'): number {
    if (valor === 'pendientes') {
      return this.tomas().filter((toma) => !toma.tomada).length;
    }
    if (valor === 'tomadas') {
      return this.tomas().filter((toma) => toma.tomada).length;
    }
    return this.tomas().length;
  }

  onChangeTomada(event: Event, toma: Toma) {
    // checkbox.checked es lo que queda guardado en tomada
    const checkbox = event.target as HTMLInputElement;

    this.tomas.update((lista) =>
      lista.map((item) => (item.id === toma.id ? { ...item, tomada: checkbox.checked } : item)),
    );
    guardarTomas(this.tomas());

    if (checkbox.checked) {
      this.gesto.set(true);
      window.clearTimeout(this.gestoTimer);
      this.gestoTimer = window.setTimeout(() => this.gesto.set(false), 700);
    }
  }

  guardarToma() {
    this.intento.set(true);

    if (this.tomaForm.invalid) {
      this.tomaForm.markAllAsTouched();
      this.aviso.set('');
      return; // no lo agrego si el formulario está mal
    }

    const valor = this.tomaForm.getRawValue();
    const id = this.editando();

    if (id !== null) {
      this.tomas.update((lista) =>
        lista.map((item) =>
          item.id === id
            ? {
                ...item,
                medicamento: valor.medicamento.trim(),
                dosis: valor.dosis.trim(),
                hora: valor.hora,
                momento: valor.momento,
              }
            : item,
        ),
      );
      this.aviso.set('Listo. El medicamento quedó actualizado.');
    } else {
      const nueva: Toma = {
        id: Date.now(),
        medicamento: valor.medicamento.trim(),
        dosis: valor.dosis.trim(),
        hora: valor.hora,
        momento: valor.momento,
        tomada: false,
      };
      this.tomas.update((lista) => [...lista, nueva]);
      this.aviso.set('Listo. El medicamento quedó en tu lista.');
    }

    guardarTomas(this.tomas());
    this.editando.set(null);
    this.tomaForm.reset({ medicamento: '', dosis: '', hora: '', momento: 'manana' });
    this.intento.set(false);
  }

  editarToma(toma: Toma) {
    this.editando.set(toma.id);
    this.intento.set(false);
    this.aviso.set('');
    this.tomaForm.setValue({
      medicamento: toma.medicamento,
      dosis: toma.dosis,
      hora: toma.hora,
      momento: toma.momento,
    });
  }

  cancelarEdicion() {
    this.editando.set(null);
    this.intento.set(false);
    this.tomaForm.reset({ medicamento: '', dosis: '', hora: '', momento: 'manana' });
  }

  eliminarToma(toma: Toma) {
    this.tomas.update((lista) => lista.filter((item) => item.id !== toma.id));
    guardarTomas(this.tomas());
    this.aviso.set('El medicamento se quitó de la lista.');
  }
}
