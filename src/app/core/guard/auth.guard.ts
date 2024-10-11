import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {

  const authService = inject(AuthService);
  const router = inject( Router );
  

  let estado: boolean = authService.loggedIn;
  
    if(!estado){
      router.navigate(['/login']);
      authService.logout();
      return false
    }

    // Obtener el rol desde sessionStorage
    const userRole = sessionStorage.getItem('role');

    const currentPath = route.routeConfig?.path;

    // Verificar si el rol es 'ADMINISTRADOR' o 'TRABAJADOR'
    if (userRole === 'Trabajador' && (currentPath === 'usuario' || currentPath === 'pago')) {
      router.navigate(['/not-authorized']); // Redirige a una página de "No autorizado"
      authService.logout();
      return false;
    }
  
    // Permitir acceso para Administradores
    if (userRole === 'Administrador') {
      return true;
    }
  
    // Si el rol no es Administrador o Trabajador, redirigir
    router.navigate(['/not-authorized']);
    return false;
};
