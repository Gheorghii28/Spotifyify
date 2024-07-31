import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CustomButtonComponent } from '../../buttons/custom-button/custom-button.component';
import { DrawerService } from '../../../services/drawer.service';
import { CloudFiles, TrackFile } from '../../../models/cloud.model';
import {
  Playlist,
  PlaylistsObject,
  TracksObject,
} from '../../../models/spotify.model';
import { DialogAddTrackComponent } from '../../dialog/dialog-add-track/dialog-add-track.component';
import { MatDialog } from '@angular/material/dialog';
import { SpotifyService } from '../../../services/spotify.service';
import { CloudService } from '../../../services/cloud.service';
import { DialogRemoveTrackComponent } from '../../dialog/dialog-remove-track/dialog-remove-track.component';
import { Subscription } from 'rxjs';
import { AudioService } from '../../../services/audio.service';

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
  constructor(
    private drawerService: DrawerService,
    private spotifyService: SpotifyService,
    private cloudService: CloudService,
    private audioService: AudioService,
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
        this.addTrackToPlaylist();
      }
    });
  }

  private async addTrackToPlaylist(): Promise<void> {
    const playlists: PlaylistsObject =
      await this.spotifyService.retrieveSpotifyData(`me/playlists`);
    this.cloudService.setMyPlaylists(playlists);
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
        this.deleteTrackFromPlaylist();
      }
    });
  }

  private async deleteTrackFromPlaylist(): Promise<void> {
    const trackIndex = this.files.tracks.findIndex(
      (track) => track.id === this.track.id
    );
    if (trackIndex !== -1) {
      this.files.tracks.splice(trackIndex, 1);
      this.cloudService.setFiles(this.files);
      const playlists: PlaylistsObject =
        await this.spotifyService.retrieveSpotifyData(`me/playlists`);
      this.cloudService.setMyPlaylists(playlists);
    }
  }

  public async saveToLikedSongs(): Promise<void> {
    if (this.track.likedStatus) {
    } else {
      await this.saveTrack(this.track.id);
    }
    await this.updateLikedStatus(this.track.id);
    await this.setMyTracks();
  }

  private async saveTrack(id: string): Promise<void> {
    try {
      const res = await this.spotifyService.updateSpotifyData(
        `me/tracks?ids=${id}`
      );
    } catch (error) {
      console.error('Error saving track:', error);
    }
  }

  private async updateLikedStatus(id: string): Promise<void> {
    if (this.playingTrack) {
      if (id === this.playingTrack.id) {
        this.playingTrack.likedStatus = true;
        this.audioService.setPlayingTrack(this.playingTrack);
      }
    }
    this.cloudService.updateLikedStatus(id, true);
  }

  private async setMyTracks(): Promise<void> {
    const tracks: TracksObject = await this.spotifyService.retrieveSpotifyData(
      `me/tracks`
    );
    this.cloudService.setMyTracks(tracks);
  }
}
