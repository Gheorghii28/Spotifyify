import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const tokenService = inject(TokenService);
  const accessToken =
    tokenService.getAccessToken() || cookieService.get('accessToken');

  if (accessToken as string) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
