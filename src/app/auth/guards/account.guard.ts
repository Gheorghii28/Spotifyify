import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const accountGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isAuthenticated()) {
    inject(Router).navigate(['/']);
    return false;
  }
  return true;
};
