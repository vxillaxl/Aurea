// lo que guardo de cada cita
export interface Cita {
  id: number;
  especialidad: string;
  ips: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada';
}
