import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TokenService } from '../services/token.service';
import { HeaderComponent } from './header/header.component';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../models/spotify.model';
import { SidenavComponent } from './sidenav/sidenav.component';
import { Subscription, fromEvent } from 'rxjs';
import { HeightService } from '../services/height.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidenavComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  userProfile!: UserProfile;
  loadSubscription!: Subscription;
  resizeSubscription!: Subscription;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private heightService: HeightService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.tokenService.saveTokensToLocalStorage();
    this.tokenService.clearTokensFromCookies();
    this.getProfile();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSubscription = fromEvent(window, 'load').subscribe(() => {
        this.heightService.adjustElementHeights();
      });
      this.resizeSubscription = fromEvent(window, 'resize').subscribe(() => {
        this.heightService.adjustElementHeights();
      });
    }
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
