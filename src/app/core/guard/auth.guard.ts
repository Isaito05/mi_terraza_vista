import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {

  const authService = inject(AuthService);
  const router = inject( Router );
  

   // Comprobar si el usuario está autenticado
  let estado: boolean = !!authService.loggedIn;
  let userRole: string = '';
  const token = sessionStorage.getItem('token');
  if(token) {
    const decodedToken: any = jwtDecode(token)
    userRole = decodedToken.rol
  }
  // Obtener el rol desde sessionStorage
  const currentPath = route.routeConfig?.path;
  console.log('Estado de autenticación (con token):', estado);
  console.log('Token:', sessionStorage.getItem('token'));
  console.log('Rol decodificado:', userRole);
  console.log('Ruta solicitada:', currentPath);
  // Si no está autenticado, redirigir al home
  if (!estado) {
    console.log('Usuario no autenticado, redirigiendo al home');
    router.navigate(['/home'])
    return false;
  }

  // Verifica el rol del usuario
  console.log('Rol de usuario:', userRole); // Verifica aquí el rol

  // Permitir acceso para Administradores
  if (userRole === 'Administrador' || userRole === 'Trabajador') {
    return true;
  }
  
  // Si el usuario es Administrador o Trabajador y ya está en la ruta de pedidos, no hacer nada
  if ((userRole === 'Administrador' || userRole === 'Trabajador') && currentPath === 'pedido') {
    console.log('Acceso permitido a la ruta:', currentPath);
    return true; // Permitir acceso a la ruta actual
  }

  // Verificar el rol y las rutas permitidas
  if (userRole === 'Trabajador' && (currentPath === 'usuario' || currentPath === 'pago')) {
    console.log('Redirigiendo a no autorizado porque el rol no es válido:', userRole);
    router.navigate(['/not-authorized']); // Redirige a una página de "No autorizado"
    return false; // Pero no cerrar sesión
  }

  // Si el rol no es válido, redirigir a "No autorizado"
  console.log('Redirigiendo a no autorizado porque el rol no es válido:', userRole);
  router.navigate(['/not-authorized']);
  return false;
};
