// tomada cambia solo cuando marcan la casilla
export interface Toma {
  id: number;
  medicamento: string;
  dosis: string;
  hora: string;
  momento: 'manana' | 'tarde' | 'noche';
  tomada: boolean;
}
