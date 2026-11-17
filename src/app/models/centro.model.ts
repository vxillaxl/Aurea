export interface Centro {
  id: number;
  nombre: string;
  tipo: 'ips' | 'farmacia';
  barrio: string;
  direccion: string; // calle real para Google Maps
  horario: string;
}
