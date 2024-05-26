import { Component, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer } from '@angular/material/sidenav';
import { DrawerService } from '../../../services/drawer.service';
import { Subscription } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../../services/spotify.service';
import { Playlist, PlaylistsObject } from '../../../models/spotify.model';
import { CloudService } from '../../../services/cloud.service';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, CommonModule],
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.scss',
})
export class NavHeaderComponent implements OnDestroy {
  @Input() drawerSidenav!: MatDrawer;
  @Input() sidenavExpanded!: boolean;
  @Input() userId!: string;
  @Input() myPlaylists!: PlaylistsObject;
  sidenavWidth!: number;
  private sidenavWidthSubscription!: Subscription;

  constructor(
    private drawerService: DrawerService,
    private spotifyService: SpotifyService,
    private cloudService: CloudService
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

  toggleDrawer(): void {
    this.drawerService.setSidenavExpanded(!this.sidenavExpanded);
  }

  toggleSidenavWidth(): void {
    const newWidth = this.sidenavWidth === 631 ? 289 : 631;
    this.drawerService.setSidenavWidth(newWidth);
  }

  public async createNewPlaylist(): Promise<void> {
    const playlistNr: number = this.myPlaylists.items.length + 1;
    const playlist: Playlist = await this.buildPlaylist(playlistNr);
    this.addPlaylistToUser(playlist);
  }

  private async buildPlaylist(playlistNr: number): Promise<Playlist> {
    const body = {
      name: `My Playlist #${playlistNr}`,
      description: 'New playlist description',
      public: true,
    };
    return await this.spotifyService.postToSpotify(
      `users/${this.userId}/playlists`,
      body
    );
  }

  private addPlaylistToUser(playlist: Playlist): void {
    this.myPlaylists.items.push(playlist);
    this.cloudService.setMyPlaylists(this.myPlaylists);
  }
}
