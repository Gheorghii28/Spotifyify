import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TokenService } from '../services/token.service';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import {
  PlaylistsObject,
  TracksObject,
  UserProfile,
} from '../models/spotify.model';
import { SidenavComponent } from './sidenav/sidenav.component';
import { lastValueFrom, Subscription } from 'rxjs';
import { LayoutService } from '../services/layout.service';
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
import { ScrollService } from '../services/scroll.service';
import { PlatformDetectionService } from '../services/platform-detection.service';

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
    CustomScrollbarDirective,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  userProfile!: UserProfile;
  loadSubscription!: Subscription;
  resizeSubscription!: Subscription;
  files!: CloudFiles;
  trackIndex!: number;
  sidenavExpanded!: boolean;
  sidenavWidth!: number;
  drawerEndStatus!: boolean;
  private cloudSubscription!: Subscription;
  private sidenavExpandedSubscription!: Subscription;
  private sidenavWidthSubscription!: Subscription;
  private drawerEndStatusSubscription!: Subscription;

  constructor(
    private tokenService: TokenService,
    private layoutService: LayoutService,
    private cloudService: CloudService,
    private drawerService: DrawerService,
    private spotifyService: SpotifyService,
    private firebaseService: FirebaseService,
    private scrollService: ScrollService,
    private platformDetectionService: PlatformDetectionService,
    private ngZone: NgZone
  ) {
    this.tokenService.saveTokensToLocalStorage();
    this.tokenService.clearTokensFromCookies();
    this.subscribeTo();
  }

  ngOnInit(): void {
    if (this.platformDetectionService.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        this.getProfile();
        this.setMyPlaylists();
        this.setMyTracks();
      });
      this.layoutService.adjustHeightOnWindowResize();
      this.layoutService.handleDrawerOnResize(this.drawerEndStatus);
    }
  }

  ngAfterViewInit(): void {
    this.scrollContainer.nativeElement.addEventListener(
      'scroll',
      (event: Event) => {
        this.scrollService.emitScrollEvent(event);
      }
    );
  }

  ngOnDestroy(): void {
    this.cloudSubscription.unsubscribe();
    this.sidenavExpandedSubscription.unsubscribe();
    this.sidenavWidthSubscription.unsubscribe();
    this.drawerEndStatusSubscription.unsubscribe();
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
    this.drawerEndStatusSubscription = this.drawerService
      .observedrawerEndStatus()
      .subscribe((status: boolean) => {
        this.drawerEndStatus = status;
      });
  }

  async getProfile(): Promise<void> {
    const profile: UserProfile = await lastValueFrom(
      this.spotifyService.getCurrentUsersProfile()
    );
    if (!this.platformDetectionService.isBrowser || profile) {
      this.userProfile = profile;
      this.firebaseService.checkUserInFirestore(this.userProfile);
    } else {
      console.error('Failed to fetch user profile.');
    }
  }

  private async setMyPlaylists(): Promise<void> {
    const playlists: PlaylistsObject = await lastValueFrom(
      this.spotifyService.getCurrentUsersPlaylists()
    );
    this.cloudService.setMyPlaylists(playlists);
  }

  private async setMyTracks(): Promise<void> {
    const tracks: TracksObject = await lastValueFrom(
      this.spotifyService.getUsersSavedTracks()
    );
    this.cloudService.setMyTracks(tracks);
  }
}
