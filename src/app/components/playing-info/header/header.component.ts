import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CustomButtonComponent } from '../../buttons/custom-button/custom-button.component';
import { DrawerService } from '../../../services/drawer.service';
import { CloudFiles, TrackFile } from '../../../models/cloud.model';
import { Playlist, PlaylistsObject } from '../../../models/spotify.model';
import { DialogAddTrackComponent } from '../../dialog/dialog-add-track/dialog-add-track.component';
import { MatDialog } from '@angular/material/dialog';
import { SpotifyService } from '../../../services/spotify.service';
import { CloudService } from '../../../services/cloud.service';
import { DialogRemoveTrackComponent } from '../../dialog/dialog-remove-track/dialog-remove-track.component';
import { lastValueFrom, Subscription } from 'rxjs';
import { AudioService } from '../../../services/audio.service';
import { LikedStatusService } from '../../../services/liked-status.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    CommonModule,
    CustomButtonComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() track!: TrackFile;
  @Input() playlist!: Playlist;
  private files!: CloudFiles;
  private playingTrack!: TrackFile;
  private cloudSubscription!: Subscription;
  private playingTrackSubscription!: Subscription;
  public isOwnedByUser: boolean = false;
  constructor(
    private drawerService: DrawerService,
    private spotifyService: SpotifyService,
    private cloudService: CloudService,
    private audioService: AudioService,
    private likedStatusService: LikedStatusService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.cloudSubscription.unsubscribe();
    this.playingTrackSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.cloudSubscription = this.cloudService
      .observeFiles()
      .subscribe((files: CloudFiles) => {
        this.files = files;
        this.checkIfPlaylistOwnedByUser();
      });
    this.playingTrackSubscription = this.audioService
      .observePlayingTrack()
      .subscribe((track: TrackFile) => {
        if (track) {
          this.playingTrack = track;
        }
      });
  }

  public closePlayingInfo(): void {
    this.drawerService.setdrawerEndStatus(false);
  }

  public getDisplayName(): string {
    return this.playlist ? this.playlist.name : this.track?.name || '';
  }

  public openAddDialog(): void {
    const dialogRef = this.dialog.open(DialogAddTrackComponent, {
      data: {
        position: 0,
        uri: this.track.uri,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cloudService.addTrackToPlaylist();
      }
    });
  }

  public openRemoveDialog(): void {
    const dialogRef = this.dialog.open(DialogRemoveTrackComponent, {
      data: {
        playlistId: this.files.id,
        snapshot_id: this.files.snapshot_id,
        uri: this.track.uri,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cloudService.deleteTrackFromPlaylist(this.files, this.track);
      }
    });
  }

  public async saveToLikedSongs(): Promise<void> {
    if (!this.track.likedStatus) {
      this.likedStatusService.saveTrack(this.track.id);
      await this.likedStatusService.checkAndUpdateLikedStatus(this.track.id, this.playingTrack);
      await this.likedStatusService.updateUserSavedTracks();
    }
  }

  public async isPlaylistOwnedByUser(): Promise<boolean> {
    const playlists: PlaylistsObject = await lastValueFrom(
      this.spotifyService.getCurrentUsersPlaylists()
    );
    
    return playlists.items.some(
      (playlist: Playlist) => playlist.id === this.files.id
    );
  }  

  private async checkIfPlaylistOwnedByUser(): Promise<void> {
    this.isOwnedByUser = await this.isPlaylistOwnedByUser();
  }
}
