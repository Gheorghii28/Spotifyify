import { Injectable } from '@angular/core';
import { BrowserStorageService } from './browser-storage.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(
    private browserStorageService: BrowserStorageService,
    private cookieService: CookieService,
    private http: HttpClient
  ) {}

  setAccessToken(token: string): void {
    this.browserStorageService.set('access_token', token);
  }

  getAccessToken(): string | null {
    return this.browserStorageService.get('access_token');
  }

  setRefreshToken(token: string): void {
    this.browserStorageService.set('refresh_token', token);
  }

  getRefreshToken(): string | null {
    return this.browserStorageService.get('refresh_token');
  }

  clearTokens(): void {
    this.browserStorageService.remove('access_token');
    this.browserStorageService.remove('refresh_token');
  }

  clearTokensFromCookies(): void {
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
  }

  saveTokensToLocalStorage(): void {
    const accessToken = this.cookieService.get('accessToken');
    const refreshToken = this.cookieService.get('refreshToken');
    if (accessToken) {
      this.setAccessToken(accessToken);
    }
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  }

 refreshAccessToken(): Observable<any> {
    const url = environment.refreshTokenUrl;
    const refreshToken = this.getRefreshToken() as string;
    const payload = { query: refreshToken };
    return this.http.post(url, payload, {responseType: 'json'});
  }
}
