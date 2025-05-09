import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { BrowserStorageService } from '../../services';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenRequest = addAuthorizationHeader(req);
  return next(tokenRequest).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('refresh')) {
        return authService.refreshTokenFn().pipe(
          switchMap(() => {
            const tokenRequest = addAuthorizationHeader(req);
            return next(tokenRequest);
          }),
          catchError((refreshError) => {
            return throwError(
              () => new Error('Failed to refresh token:', refreshError)
            );
          })
        );
      }
      return throwError(() => new Error('Failed to request token:', error));
    })
  );
};

const addAuthorizationHeader = (req: HttpRequest<any>) => {
  const accessToken = inject(BrowserStorageService).get('access_token');
  if (accessToken) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });
  }
  return req;
};
