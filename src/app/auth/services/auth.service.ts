import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BrowserStorageService } from '../../services/browser-storage.service';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private browserStorageService: BrowserStorageService,
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient
  ) {}

  public init(): void {
    this.storeToken();
  }

  public login(): void {
    window.location.href = environment.loginUrl;
  }

  public logout(): void {
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    return this.hasValidAccessToken();
  }

  private hasValidAccessToken(): boolean {
    const token = this.browserStorageService.get('access_token');
    if (!token) {
      return false;
    }
    const expiration = this.browserStorageService.get('expiration_time');
    if (!expiration) {
      return false;
    }
    const expirationTime = parseInt(expiration);
    const now = new Date().getTime();
    return expirationTime > now;
  }

  private clearTokens(): void {
    this.browserStorageService.remove('access_token');
    this.browserStorageService.remove('refresh_token');
    this.browserStorageService.remove('expiration_time');
    this.cookieService.delete('accessToken', '/', environment.domain);
    this.cookieService.delete('refreshToken', '/', environment.domain);
    this.cookieService.delete('expirationTime', '/', environment.domain);
  }

  public storeToken(): void {
    const accessToken = this.cookieService.get('accessToken');
    const refreshToken = this.cookieService.get('refreshToken');
    const expirationTime = this.cookieService.get('expirationTime');
    if (accessToken && refreshToken && expirationTime) {
      this.updateTokens(accessToken, refreshToken, expirationTime);
    }
  }

  private updateTokens(
    accessToken: string,
    refreshToken: string,
    expirationTime: string
  ): void {
    this.browserStorageService.set('access_token', accessToken);
    this.browserStorageService.set('refresh_token', refreshToken);
    this.browserStorageService.set('expiration_time', expirationTime);
    this.scheduleTokenRefresh(parseInt(expirationTime));
  }

  private scheduleTokenRefresh(expirationTime: number): void {
    const refreshTime = expirationTime - new Date().getTime();
    setTimeout(() => {
      this.refreshTokenFn().subscribe();
    }, refreshTime);
  }

  public refreshTokenFn(): Observable<void> {
    const url = environment.refreshTokenUrl;
    const refreshToken = this.browserStorageService.get('refresh_token');
    const payload = { query: refreshToken };
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    return this.http.post<any>(url, payload, options).pipe(
      tap((response) => {
        const expirationTime =
          new Date().getTime() + response.expires_in * 1000;
        this.updateTokens(
          response.access_token,
          response.refresh_token,
          expirationTime.toString()
        );
      }),
      catchError((error) => {
        console.error('Refresh token error:', error);
        return throwError(() => new Error(`Failed to refresh token`));
      })
    );
  }
}
