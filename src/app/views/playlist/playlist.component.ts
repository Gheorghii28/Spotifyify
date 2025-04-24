import { Component, effect, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewHeaderComponent } from '../../components/view-header/view-header.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CommonModule } from '@angular/common';
import { CloudFiles } from '../../models/cloud.model';
import { CloudService } from '../../services/cloud.service';
import { lastValueFrom } from 'rxjs';
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
export class PlaylistComponent implements OnInit {
  isFollowing!: boolean;

  constructor(
    private route: ActivatedRoute,
    public cloudService: CloudService,
    public audioService: AudioService,
    private spotifyService: SpotifyService,
    private dialog: MatDialog,
  ) {
    effect(async () => {
      const files: CloudFiles = this.cloudService.files();
      if (files.id.length > 0) {
        const response: boolean[] = await lastValueFrom(
          this.spotifyService.checkIfCurrentUserFollowsPlaylist(files.id)
        );
        this.isFollowing = response[0];
      }
    });
  }

  ngOnInit(): void {
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
      this.cloudService.files.set(files);
    });
  }
  
  public openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DialogRemovePlaylistComponent, {
      data: { name: this.cloudService.files().name, id: this.cloudService.files().id },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openChangeDialog(): void {
    const dialogRef = this.dialog.open(DialogChangePlaylistDetailsComponent, {
      data: { 
        id: this.cloudService.files().id, 
        name: this.cloudService.files().name, 
        description: this.cloudService.files().description 
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
