import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TokenService } from '../services/token.service';
import { HeaderComponent } from './header/header.component';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../models/user-profile.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  userProfile!: UserProfile;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.tokenService.saveTokensToLocalStorage();
    this.tokenService.clearTokensFromCookies();
    this.getProfile();
  }

  async getProfile(): Promise<void> {
    const accessToken = this.tokenService.getAccessToken();
    const profile: UserProfile = await this.authService.getProfile(accessToken);
    if (!isPlatformBrowser(this.platformId) || profile) {
      this.userProfile = profile;
    } else {
      console.error('Failed to fetch user profile.');
    }
  }
}
