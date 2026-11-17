import { Routes } from '@angular/router';
import { Cerca } from './cerca/cerca';
import { Citas } from './citas/citas';
import { Entrar } from './entrar/entrar';
import { Historial } from './historial/historial';
import { Hoy } from './hoy/hoy';
import { Perfil } from './perfil/perfil';
import { exigirSesion, soloInvitado } from './sesion.guard';
import { Tomas } from './tomas/tomas';

// cada path abre un componente. el vacio es Inicio
export const routes: Routes = [
  { path: 'entrar', component: Entrar, canActivate: [soloInvitado] },
  { path: '', component: Hoy, canActivate: [exigirSesion] },
  { path: 'citas', component: Citas, canActivate: [exigirSesion] },
  { path: 'medicamentos', component: Tomas, canActivate: [exigirSesion] },
  { path: 'historial', component: Historial, canActivate: [exigirSesion] },
  { path: 'centros', component: Cerca, canActivate: [exigirSesion] },
  { path: 'perfil', component: Perfil, canActivate: [exigirSesion] },
  { path: '**', redirectTo: '' },
];
