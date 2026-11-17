# Aurea

Interfaz en **Angular** para organizar citas médicas y medicamentos en Pasto, Nariño.  
Proyecto Final de Electiva III · Frameworks Frontend con TypeScript.

Los datos y la cuenta viven **solo en este navegador** (`localStorage`). No hay servidor.

## Cómo correrla

```bash
npm install
npx ng serve --port 4200 --host localhost
```

Abre [http://localhost:4200/](http://localhost:4200/).

**Cuenta de prueba:** `bryan@aurea.com` · contraseña `aurea`  
Si creas otra cuenta, empieza vacía (sin citas ni medicamentos).

## Qué puedes hacer

- Entrar / crear cuenta / cerrar sesión
- Ver el día (próxima cita y dosis)
- Agendar, editar y quitar citas
- Guardar medicamentos y marcarlos con casilla
- Ver historial, centros de Pasto (con Google Maps) y perfil
- Recibir avisos en pantalla (dosis a la hora o cita un día antes)

## Temas de Angular usados en clase

| Tema | Dónde se ve |
| --- | --- |
| Rutas (`Router`) | `src/app/app.routes.ts` |
| Guard (`CanActivateFn`) | `src/app/sesion.guard.ts` |
| Signals | `src/app/datos/aurea.datos.ts`, pantallas de citas y medicamentos |
| `*ngFor` / `*ngIf` / `ngClass` | plantillas HTML (Inicio, Citas, Medicamentos…) |
| Formularios reactivos (`FormBuilder`, `Validators`) | Citas, Medicamentos, Perfil, Entrar |
| Checkbox `(change)` | Inicio y Medicamentos (marcar dosis) |
| `localStorage` por cuenta | `src/app/datos/aurea.datos.ts` |

## Estructura útil

- `src/app/hoy` — Inicio  
- `src/app/citas` — Citas  
- `src/app/tomas` — Medicamentos  
- `src/app/historial` — Historial  
- `src/app/cerca` — Centros  
- `src/app/perfil` — Perfil  
- `src/app/entrar` — Login / registro  

## Nota

Aurea es una interfaz frontend. No envía notificaciones al celular ni guarda datos en un servidor.

## Sesión y rutas

- Login y registro en `src/app/entrar`
- Guard `exigirSesion` / `soloInvitado` en `src/app/sesion.guard.ts`
- Rutas protegidas en `src/app/app.routes.ts`

## Citas y medicamentos

- Citas con formularios reactivos, filtros y `localStorage` por cuenta
- Medicamentos con checkbox `(change)`, signals y historial de tomas
- Pantallas: `src/app/citas`, `src/app/tomas`, `src/app/historial`

## Centros, perfil y avisos

- Directorio de Pasto con Google Maps en `src/app/cerca`
- Perfil editable y cierre de sesión en `src/app/perfil`
- Avisos en pantalla (dosis a la hora / cita un día antes) en `src/app/app.ts`
