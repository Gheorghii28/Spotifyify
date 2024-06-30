import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private tokenService: TokenService,
    private router: Router
  ) {}

  login(): void {
    window.location.href = environment.loginUrl;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  async getProfile(accessToken: string | null): Promise<any | null> {
    if (!isPlatformBrowser(this.platformId) || !accessToken) return null;

    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this.handleProfileError(error);
      return null;
    }
  }

  private handleProfileError(error: any): void {
    this.tokenService.refreshAccessToken().subscribe({
      next: (data) => {
        const accessToken = data.access_token;
        this.tokenService.setAccessToken(accessToken);
      },
      error: (error) => {
        console.error('Error refreshing access token:', error);
      },
    });
    console.error('Error fetching user profile:', error);
  }
}
