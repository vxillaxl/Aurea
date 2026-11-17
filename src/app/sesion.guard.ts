import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { sesionActual } from './datos/aurea.datos';

export const exigirSesion: CanActivateFn = () => {
  if (sesionActual()) {
    return true;
  }
  return inject(Router).createUrlTree(['/entrar']);
};

export const soloInvitado: CanActivateFn = () => {
  if (!sesionActual()) {
    return true;
  }
  return inject(Router).createUrlTree(['/']);
};
