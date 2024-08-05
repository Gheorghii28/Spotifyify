import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private tokenService: TokenService, private router: Router) {}

  login(): void {
    window.location.href = environment.loginUrl;
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.tokenService.clearTokensFromCookies();
    this.router.navigate(['/login']);
  }
}
