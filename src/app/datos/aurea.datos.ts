import { signal } from '@angular/core';
import { Centro } from '../models/centro.model';
import { Cita } from '../models/cita.model';
import { Cuenta, Sesion } from '../models/cuenta.model';
import { PerfilGuardado } from '../models/perfil.model';
import { Toma } from '../models/toma.model';

const CLAVE_PERFIL = 'aurea-perfil';
const CLAVE_CUENTAS = 'aurea-cuentas';
const CLAVE_SESION = 'aurea-sesion';
const CLAVE_MIGRA = 'aurea-cuenta-datos-v1'; // una sola vez: paso lo viejo a la cuenta demo
const CLAVE_SEMILLA_DEMO = 'aurea-semilla-demo';
const SEMILLA_DEMO = '2026-11-17'; // si cambia, se renuevan los ejemplos de Bryan
const CORREO_DEMO = 'bryan@aurea.com';

function claveCitas(correo: string): string {
  return `aurea-citas:${correo}`;
}

function claveTomas(correo: string): string {
  return `aurea-tomas:${correo}`;
}

const cuentaEjemplo: Cuenta = {
  nombre: 'Bryan',
  apellido: 'Ramírez',
  correo: 'bryan@aurea.com',
  clave: 'aurea',
};

const perfilInicial: PerfilGuardado = { nombre: 'Bryan', apellido: 'Ramírez' };

function fechaISO(dias: number): string {
  const fecha = new Date();
  fecha.setHours(12, 0, 0, 0);
  fecha.setDate(fecha.getDate() + dias);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

const citasIniciales: Cita[] = [
  {
    id: 9,
    especialidad: 'Medicina general',
    ips: 'Hospital San Pedro',
    fecha: fechaISO(0), // hoy: sale en Inicio y en avisos del día
    hora: '09:00',
    estado: 'confirmada',
  },
  {
    id: 10,
    especialidad: 'Control de laboratorio',
    ips: 'IPS Las Cuadras',
    fecha: fechaISO(1), // mañana: aviso "un día antes"
    hora: '07:30',
    estado: 'pendiente',
  },
  {
    id: 1,
    especialidad: 'Control de tensión',
    ips: 'Hospital Universitario Departamental de Nariño',
    fecha: '2026-11-20',
    hora: '08:30',
    estado: 'confirmada',
  },
  {
    id: 2,
    especialidad: 'Medicina familiar',
    ips: 'Hospital San Pedro',
    fecha: '2026-11-20',
    hora: '16:00',
    estado: 'pendiente',
  },
  {
    id: 3,
    especialidad: 'Odontología',
    ips: 'IPS Municipal de Pasto',
    fecha: '2026-11-21',
    hora: '10:15',
    estado: 'confirmada',
  },
  {
    id: 4,
    especialidad: 'Toma de muestras',
    ips: 'IPS Las Cuadras',
    fecha: '2026-11-24',
    hora: '07:20',
    estado: 'pendiente',
  },
  {
    id: 5,
    especialidad: 'Dermatología',
    ips: 'Hospital San Pedro',
    fecha: '2026-11-26',
    hora: '14:40',
    estado: 'confirmada',
  },
  {
    id: 6,
    especialidad: 'Optometría',
    ips: 'IPS Municipal de Pasto',
    fecha: '2026-11-28',
    hora: '09:00',
    estado: 'pendiente',
  },
  {
    id: 7,
    especialidad: 'Cardiología',
    ips: 'Hospital Universitario Departamental de Nariño',
    fecha: '2026-12-02',
    hora: '11:30',
    estado: 'confirmada',
  },
  {
    id: 8,
    especialidad: 'Nutrición',
    ips: 'IPS Las Cuadras',
    fecha: '2026-12-05',
    hora: '15:45',
    estado: 'pendiente',
  },
];

const tomasIniciales: Toma[] = [
  {
    id: 1,
    medicamento: 'Losartán',
    dosis: '50 mg',
    hora: '07:00',
    momento: 'manana',
    tomada: true,
  },
  {
    id: 2,
    medicamento: 'Metformina',
    dosis: '850 mg',
    hora: '08:00',
    momento: 'manana',
    tomada: false,
  },
  {
    id: 3,
    medicamento: 'Ácido acetilsalicílico',
    dosis: '100 mg',
    hora: '09:00',
    momento: 'manana',
    tomada: false,
  },
  {
    id: 4,
    medicamento: 'Ibuprofeno',
    dosis: '400 mg',
    hora: '14:00',
    momento: 'tarde',
    tomada: false,
  },
  {
    id: 5,
    medicamento: 'Vitamina D',
    dosis: '1000 UI',
    hora: '18:00',
    momento: 'tarde',
    tomada: true,
  },
  {
    id: 6,
    medicamento: 'Omeprazol',
    dosis: '20 mg',
    hora: '20:30',
    momento: 'noche',
    tomada: false,
  },
];

export const centros: Centro[] = [
  {
    id: 1,
    nombre: 'Hospital Universitario Departamental de Nariño',
    tipo: 'ips',
    barrio: 'Parque Bolívar',
    direccion: 'Calle 22 No. 7-93, Parque Bolívar, Pasto, Nariño',
    horario: 'Urgencias 24 horas',
  },
  {
    id: 2,
    nombre: 'Hospital San Pedro',
    tipo: 'ips',
    barrio: 'San Pedro',
    direccion: 'Calle 16 Carrera 43 esquina, Pasto, Nariño',
    horario: 'Lun a vie · 7:00 a 17:00',
  },
  {
    id: 3,
    nombre: 'IPS Municipal de Pasto',
    tipo: 'ips',
    barrio: 'Centro',
    direccion: 'Carrera 20 No. 19B-22, Pasto Salud E.S.E., Pasto, Nariño',
    horario: 'Lun a vie · 7:00 a 16:00',
  },
  {
    id: 4,
    nombre: 'IPS Las Cuadras',
    tipo: 'ips',
    barrio: 'Las Cuadras',
    direccion: 'Carrera 31 No. 19A-10, Las Cuadras, Pasto, Nariño',
    horario: 'Lun a sab · 7:00 a 13:00',
  },
  {
    id: 5,
    nombre: 'Cruz Verde',
    tipo: 'farmacia',
    barrio: 'Valle de Atriz',
    direccion: 'Carrera 42 No. 18A-94, Avenida Panamericana, Pasto, Nariño',
    horario: '7:00 a 21:00',
  },
  {
    id: 6,
    nombre: 'Droguería La Rebaja',
    tipo: 'farmacia',
    barrio: 'Centro',
    direccion: 'Calle 16 No. 23-03, Pasto, Nariño',
    horario: '8:00 a 20:00',
  },
  {
    id: 7,
    nombre: 'Cruz Verde Casa Zarama',
    tipo: 'farmacia',
    barrio: 'Centro',
    direccion: 'Carrera 24 No. 17-86, Pasto, Nariño',
    horario: '8:00 a 19:00',
  },
  {
    id: 8,
    nombre: 'Droguería Pasteur',
    tipo: 'farmacia',
    barrio: 'Parque Infantil',
    direccion: 'Calle 18 No. 30-74, Parque Infantil, Pasto, Nariño',
    horario: '8:00 a 22:00',
  },
];

function correoActual(): string | null {
  return leerSesion()?.correo ?? null;
}

// si había citas viejas sin dueño, se las dejo a la cuenta demo
function migrarDatosViejos() {
  if (localStorage.getItem(CLAVE_MIGRA)) {
    return;
  }
  const citasViejas = localStorage.getItem('aurea-citas');
  const tomasViejas = localStorage.getItem('aurea-tomas');
  if (citasViejas && !localStorage.getItem(claveCitas(CORREO_DEMO))) {
    localStorage.setItem(claveCitas(CORREO_DEMO), citasViejas);
  }
  if (tomasViejas && !localStorage.getItem(claveTomas(CORREO_DEMO))) {
    localStorage.setItem(claveTomas(CORREO_DEMO), tomasViejas);
  }
  localStorage.removeItem('aurea-citas');
  localStorage.removeItem('aurea-tomas');
  localStorage.removeItem('aurea-version');
  localStorage.setItem(CLAVE_MIGRA, '1');
}

function semillasDe(correo: string): { citas: Cita[]; tomas: Toma[] } {
  // solo la cuenta de prueba nace con ejemplos
  if (correo === CORREO_DEMO) {
    return { citas: citasIniciales, tomas: tomasIniciales };
  }
  return { citas: [], tomas: [] };
}

function asegurarDatosCuenta(correo: string) {
  migrarDatosViejos();
  if (correo === CORREO_DEMO && localStorage.getItem(CLAVE_SEMILLA_DEMO) !== SEMILLA_DEMO) {
    localStorage.setItem(claveCitas(correo), JSON.stringify(citasIniciales));
    localStorage.setItem(claveTomas(correo), JSON.stringify(tomasIniciales));
    localStorage.setItem(CLAVE_SEMILLA_DEMO, SEMILLA_DEMO);
    return;
  }
  if (!localStorage.getItem(claveCitas(correo))) {
    localStorage.setItem(claveCitas(correo), JSON.stringify(semillasDe(correo).citas));
  }
  if (!localStorage.getItem(claveTomas(correo))) {
    localStorage.setItem(claveTomas(correo), JSON.stringify(semillasDe(correo).tomas));
  }
}

export function leerCitas(): Cita[] {
  const correo = correoActual();
  if (!correo) {
    return [];
  }
  asegurarDatosCuenta(correo);
  const guardadas = localStorage.getItem(claveCitas(correo));
  return guardadas ? (JSON.parse(guardadas) as Cita[]) : [];
}

export const citasActuales = signal<Cita[]>([]);

export function guardarCitas(citas: Cita[]) {
  const correo = correoActual();
  if (!correo) {
    return;
  }
  localStorage.setItem(claveCitas(correo), JSON.stringify(citas));
  citasActuales.set(citas);
}

export function leerTomas(): Toma[] {
  const correo = correoActual();
  if (!correo) {
    return [];
  }
  asegurarDatosCuenta(correo);
  const guardadas = localStorage.getItem(claveTomas(correo));
  return guardadas ? (JSON.parse(guardadas) as Toma[]) : [];
}

export const tomasActuales = signal<Toma[]>([]);

export function guardarTomas(tomas: Toma[]) {
  const correo = correoActual();
  if (!correo) {
    return;
  }
  localStorage.setItem(claveTomas(correo), JSON.stringify(tomas));
  tomasActuales.set(tomas);
}

function cargarDatosDeSesion() {
  citasActuales.set(leerCitas());
  tomasActuales.set(leerTomas());
}

export function leerPerfil(): PerfilGuardado {
  const guardado = localStorage.getItem(CLAVE_PERFIL);
  if (guardado) {
    return JSON.parse(guardado) as PerfilGuardado;
  }
  localStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfilInicial));
  return perfilInicial;
}

// el saludo de arriba y la pantalla de perfil leen este mismo signal
export const perfilActual = signal<PerfilGuardado>(leerPerfil());

export function guardarPerfil(perfil: PerfilGuardado) {
  localStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil));
  perfilActual.set(perfil);
  const actual = sesionActual();
  if (!actual) {
    return;
  }
  const cuentas = leerCuentas().map((cuenta) =>
    cuenta.correo === actual.correo ? { ...cuenta, nombre: perfil.nombre, apellido: perfil.apellido } : cuenta,
  );
  localStorage.setItem(CLAVE_CUENTAS, JSON.stringify(cuentas));
  const sesion = { ...actual, nombre: perfil.nombre, apellido: perfil.apellido };
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  sesionActual.set(sesion);
}

function leerCuentas(): Cuenta[] {
  const guardadas = localStorage.getItem(CLAVE_CUENTAS);
  if (guardadas) {
    return JSON.parse(guardadas) as Cuenta[];
  }
  localStorage.setItem(CLAVE_CUENTAS, JSON.stringify([cuentaEjemplo]));
  return [cuentaEjemplo];
}

export function leerSesion(): Sesion | null {
  const guardada = localStorage.getItem(CLAVE_SESION);
  if (!guardada) {
    return null;
  }
  return JSON.parse(guardada) as Sesion;
}

export const sesionActual = signal<Sesion | null>(leerSesion());

// si ya hay sesión al abrir la app, cargo las citas de esa cuenta
if (sesionActual()) {
  cargarDatosDeSesion();
}

export function entrarConCuenta(correo: string, clave: string): string {
  const cuenta = leerCuentas().find((item) => item.correo === correo.trim().toLowerCase());
  if (!cuenta || cuenta.clave !== clave) {
    return 'Correo o contraseña incorrectos.';
  }
  const sesion: Sesion = { nombre: cuenta.nombre, apellido: cuenta.apellido, correo: cuenta.correo };
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  sesionActual.set(sesion);
  asegurarDatosCuenta(cuenta.correo);
  cargarDatosDeSesion();
  guardarPerfil({ nombre: cuenta.nombre, apellido: cuenta.apellido });
  return '';
}

export function crearCuenta(cuenta: Cuenta): string {
  const correo = cuenta.correo.trim().toLowerCase();
  const cuentas = leerCuentas();
  if (cuentas.some((item) => item.correo === correo)) {
    return 'Ese correo ya tiene una cuenta.';
  }
  const nueva = { ...cuenta, correo, nombre: cuenta.nombre.trim(), apellido: cuenta.apellido.trim() };
  localStorage.setItem(CLAVE_CUENTAS, JSON.stringify([...cuentas, nueva]));
  // cuenta nueva: vacía, sin los ejemplos de Bryan
  localStorage.setItem(claveCitas(correo), JSON.stringify([]));
  localStorage.setItem(claveTomas(correo), JSON.stringify([]));
  return entrarConCuenta(nueva.correo, nueva.clave);
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  sesionActual.set(null);
  citasActuales.set([]);
  tomasActuales.set([]);
}

export function fechaDeHoy(): string {
  return fechaISO(0);
}

export function formatearFecha(iso: string): string {
  const [anio, mes, dia] = iso.split('-');
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${Number(dia)} ${meses[Number(mes) - 1]} ${anio}`;
}
