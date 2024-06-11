import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { TokenService } from '../services/token.service';
import { HeaderComponent } from './header/header.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import {
  PlaylistsObject,
  TracksObject,
  UserProfile,
} from '../models/spotify.model';
import { SidenavComponent } from './sidenav/sidenav.component';
import { Subscription } from 'rxjs';
import { HeightService } from '../services/height.service';
import { RouterOutlet } from '@angular/router';
import { PlayerComponent } from '../components/player/player.component';
import { CloudFiles } from '../models/cloud.model';
import { CloudService } from '../services/cloud.service';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { PlayingInfoComponent } from '../components/playing-info/playing-info.component';
import { DrawerService } from '../services/drawer.service';
import { SpotifyService } from '../services/spotify.service';
import { CustomScrollbarDirective } from '../directives/custom-scrollbar.directive';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    SidenavComponent,
    RouterOutlet,
    PlayerComponent,
    PlayingInfoComponent,
    CommonModule,
    MatDrawer,
    MatSidenavModule,
    CustomScrollbarDirective
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  userProfile!: UserProfile;
  loadSubscription!: Subscription;
  resizeSubscription!: Subscription;
  files!: CloudFiles;
  trackIndex!: number;
  sidenavExpanded!: boolean;
  sidenavWidth!: number;
  private cloudSubscription!: Subscription;
  private sidenavExpandedSubscription!: Subscription;
  private sidenavWidthSubscription!: Subscription;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private heightService: HeightService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cloudService: CloudService,
    private drawerService: DrawerService,
    private spotifyService: SpotifyService,
    private firebaseService: FirebaseService
  ) {
    this.tokenService.saveTokensToLocalStorage();
    this.tokenService.clearTokensFromCookies();
    this.getProfile();
    this.setMyPlaylists();
    this.setMyTracks();
    this.subscribeTo();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.heightService.adjustHeightOnWindowResize();
    }
  }

  ngOnDestroy(): void {
    this.cloudSubscription.unsubscribe();
    this.sidenavExpandedSubscription.unsubscribe();
    this.sidenavWidthSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.cloudSubscription = this.cloudService
      .observeFiles()
      .subscribe((files: CloudFiles) => {
        this.files = files;
      });
    this.sidenavExpandedSubscription = this.drawerService
      .observeSidenavExpanded()
      .subscribe((expanded: boolean) => {
        this.sidenavExpanded = expanded;
      });
    this.sidenavWidthSubscription = this.drawerService
      .observeSidenavWidth()
      .subscribe((width: number) => {
        this.sidenavWidth = width;
      });
  }

  async getProfile(): Promise<void> {
    const accessToken = this.tokenService.getAccessToken();
    const profile: UserProfile = await this.authService.getProfile(accessToken);
    if (!isPlatformBrowser(this.platformId) || profile) {
      this.userProfile = profile;
      this.firebaseService.checkUserInFirestore(this.userProfile);
    } else {
      console.error('Failed to fetch user profile.');
    }
  }

  private async setMyPlaylists(): Promise<void> {
    const playlists: PlaylistsObject =
      await this.spotifyService.retrieveSpotifyData(`me/playlists`);
    this.cloudService.setMyPlaylists(playlists);
  }

  private async setMyTracks(): Promise<void> {
    const tracks: TracksObject = await this.spotifyService.retrieveSpotifyData(
      `me/tracks`
    );
    this.cloudService.setMyTracks(tracks);
  }
}
