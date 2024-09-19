import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject( Router );

  let estado: boolean = authService.loggedIn;
  
    if(!estado){
      router.navigate(['/login']);
      return false
    }
  return true;
};
