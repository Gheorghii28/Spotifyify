import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewHeaderComponent } from '../../components/view-header/view-header.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CommonModule } from '@angular/common';
import { CloudFiles, TrackFile } from '../../models/cloud.model';
import { CloudService } from '../../services/cloud.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { StreamState } from '../../models/stream-state.model';
import { AudioService } from '../../services/audio.service';
import { TrackListHeaderComponent } from '../../components/track-list-header/track-list-header.component';
import { BtnPlayComponent } from '../../components/buttons/btn-play/btn-play.component';
import { Playlist, PlaylistsObject } from '../../models/spotify.model';
import { SpotifyService } from '../../services/spotify.service';
import { BtnFollowComponent } from '../../components/buttons/btn-follow/btn-follow.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CustomButtonComponent } from '../../components/buttons/custom-button/custom-button.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogRemovePlaylistComponent } from '../../components/dialog/dialog-remove-playlist/dialog-remove-playlist.component';
import { DialogChangePlaylistDetailsComponent } from '../../components/dialog/dialog-change-playlist-details/dialog-change-playlist-details.component';
import { DialogChangePlaylistDetailsData } from '../../models/dialog.model';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    ViewHeaderComponent,
    TrackListComponent,
    CommonModule,
    TrackListHeaderComponent,
    BtnPlayComponent,
    BtnFollowComponent,
    MatButtonModule,
    MatMenuModule,
    CustomButtonComponent,
  ],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit, OnDestroy {
  playlistFile!: CloudFiles;
  isFollowing!: boolean;
  private cloudSubscription!: Subscription;
  public state!: StreamState;
  public playingTrack!: TrackFile;
  private stateSubscription!: Subscription;
  private playingTrackSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cloudService: CloudService,
    public audioService: AudioService,
    private spotifyService: SpotifyService,
    private dialog: MatDialog,
  ) {
    this.subscribeTo();
  }

  ngOnInit(): void {
    this.playlistFile = this.cloudService.initialFiles;
    this.route.params.subscribe(async (params) => {
      const playlistId = params['id'];
      const myPlaylists: PlaylistsObject = await lastValueFrom(
        this.spotifyService.getCurrentUsersPlaylists()
      );
      const files: CloudFiles = await this.cloudService.getFiles(playlistId);
      const isUserCreated = myPlaylists.items.some(
        (playlist: Playlist) => playlist.id === files.id
      );
      files.isUserCreated = isUserCreated;
      this.cloudService.setFiles(files);
    });
  }

  ngOnDestroy(): void {
    this.cloudSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
    this.playingTrackSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.cloudSubscription = this.cloudService
      .observeFiles()
      .subscribe(async (files: CloudFiles) => {
        if (files.id.length > 0) {
          this.playlistFile = files;
          const response: boolean[] = await lastValueFrom(
            this.spotifyService.checkIfCurrentUserFollowsPlaylist(files.id)
          );
          this.isFollowing = response[0];
        }
      });
    this.stateSubscription = this.audioService
      .observeStreamState()
      .subscribe((state: StreamState) => {
        this.state = state;
      });
    this.playingTrackSubscription = this.audioService
      .observePlayingTrack()
      .subscribe((track: TrackFile) => {
        this.playingTrack = track;
      });
  } 
  
  public openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DialogRemovePlaylistComponent, {
      data: { name: this.playlistFile.name, id: this.playlistFile.id },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openChangeDialog(): void {
    const dialogRef = this.dialog.open(DialogChangePlaylistDetailsComponent, {
      data: { 
        id: this.playlistFile.id, 
        name: this.playlistFile.name, 
        description: this.playlistFile.description 
      },
    });

    dialogRef.afterClosed().subscribe((result: DialogChangePlaylistDetailsData) => {
      if (result) {
        this.spotifyService.changePlaylistDetails(result).subscribe({
          next: (response) => {
            this.cloudService.updatePlaylistDetails(result);
         },
          error: (err) => {
            console.error('Failed to update playlist:', err);
          }
        });
      } else {
        console.log('Dialog was closed without changes');
      }
    });
  }
}
