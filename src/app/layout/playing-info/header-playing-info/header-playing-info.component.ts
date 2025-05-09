import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { CustomButtonComponent } from '../../../components/buttons/custom-button/custom-button.component';
import { DialogAddTrackComponent } from '../../../components/dialog/dialog-add-track/dialog-add-track.component';
import { DialogRemoveTrackComponent } from '../../../components/dialog/dialog-remove-track/dialog-remove-track.component';
import { Track } from '../../../models';
import { AudioService, DrawerService, LikedTracksService, SpotifyService } from '../../../services';
import { PlaylistManagerService } from '../../services/playlist-manager.service';

@Component({
  selector: 'app-header-playing-info',
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    CustomButtonComponent,
  ],
  templateUrl: './header-playing-info.component.html',
  styleUrl: './header-playing-info.component.scss',
})
export class HeaderPlayingInfoComponent {
  private likedTracksService = inject(LikedTracksService);
  private drawerService = inject(DrawerService);
  private spotifyService = inject(SpotifyService);
  private audioService = inject(AudioService);
  private playlistManager = inject(PlaylistManagerService);
  private dialog = inject(MatDialog);

  trackIsLiked = computed(() => {
    const id = this.audioService.playingTrack()?.id;
    if (!id) return false;
    return this.likedTracksService.isLiked(id)();
  });
  isOwnedByUser = computed(() => {
    const id = this.audioService.playingTrack()?.playlistId;
    if (!id) return false;
    return this.playlistManager.myPlaylists().some(p => p.id === id);
  });

  @Input() track!: Track;

  public closePlayingInfo(): void {
    this.drawerService.isDrawerInfoOpened.set(false);
  }

  public getDisplayName(): string {
    return this.track?.name || '';
  }

  public openAddDialog(): void {
    const dialogRef = this.dialog.open(DialogAddTrackComponent, {
      data: {
        position: 0,
        uri: this.track.uri,
        track: this.track
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  public async openRemoveDialog(): Promise<void> {
    const snapshotId = await lastValueFrom(
      this.spotifyService.getPlaylistSnapshotId(this.track.playlistId as string)
    );
    const dialogRef = this.dialog.open(DialogRemoveTrackComponent, {
      data: {
        playlistId: this.track.playlistId,
        snapshot_id: snapshotId,
        uri: this.track.uri,
        trackId: this.track.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  public async saveToLikedSongs(): Promise<void> {
    this.likedTracksService.toggleLike(this.track.id as string);
    await lastValueFrom(
      this.spotifyService.saveTracksForCurrentUser(this.track.id as string)
    );
  }
}
