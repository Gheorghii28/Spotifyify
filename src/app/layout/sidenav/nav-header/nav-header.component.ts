import { Component, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer } from '@angular/material/sidenav';
import { DrawerService } from '../../../services/drawer.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../../services/spotify.service';
import { Playlist, PlaylistsObject } from '../../../models/spotify.model';
import { CloudService } from '../../../services/cloud.service';
import { CustomButtonComponent } from '../../../components/buttons/custom-button/custom-button.component';
import { FirebaseService } from '../../../services/firebase.service';
import { UserFirebaseData } from '../../../models/firebase.model';
import { UtilsService } from '../../../services/utils.service';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    CommonModule,
    CustomButtonComponent,
  ],
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.scss',
})
export class NavHeaderComponent implements OnDestroy {
  @Input() drawerSidenav!: MatDrawer;
  @Input() sidenavExpanded!: boolean;
  @Input() userId!: string;
  @Input() myPlaylists!: PlaylistsObject;
  @Input() userFirebaseData!: UserFirebaseData;
  sidenavWidth!: number;
  private sidenavWidthSubscription!: Subscription;

  constructor(
    private drawerService: DrawerService,
    private spotifyService: SpotifyService,
    private cloudService: CloudService,
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    public layoutService: LayoutService
  ) {
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.sidenavWidthSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.sidenavWidthSubscription = this.drawerService
      .observeSidenavWidth()
      .subscribe((width: number) => {
        this.sidenavWidth = width;
      });
  }

  public toggleDrawer(): void {
    const newExpandedState = !this.sidenavExpanded;
    const newDrawerEndState = this.sidenavExpanded;
    if (this.layoutService.isWindowWidthLessThan(1008)) {
      this.drawerService.setdrawerEndStatus(newDrawerEndState);
    }
    this.drawerService.setSidenavExpanded(newExpandedState);
  }

  public toggleSidenavWidth(): void {
    const newWidth = this.sidenavWidth === 631 ? 289 : 631;
    this.drawerService.setSidenavWidth(newWidth);
    this.drawerService.updateDrawerEndStatusBasedOnSidenavWidth(newWidth);
  }

  public async createNewPlaylist(): Promise<void> {
    try {
      const playlistNr: number = this.myPlaylists.items.length + 1;
      const playlist: Playlist = await lastValueFrom(
        this.spotifyService.createPlaylist(this.userId, playlistNr)
      );
      this.addPlaylistToUser(playlist);
    } catch (error) {
      console.error('Error created playlist:', error);
    }
  }

  public async createPlaylistFolder(): Promise<void> {
    const folderId = this.utilsService.randomString(11);
    await this.firebaseService.updateDocument('users', this.userId, {
      folders: [
        ...this.userFirebaseData.folders,
        { id: folderId, name: 'New Folder', playlists: [] },
      ],
    });
  }

  private addPlaylistToUser(playlist: Playlist): void {
    this.myPlaylists.items.push(playlist);
    this.cloudService.setMyPlaylists(this.myPlaylists);
  }
}
