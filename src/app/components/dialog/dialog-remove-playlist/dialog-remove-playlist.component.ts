import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogRemovePlaylistData } from '../../../models/dialog.model';
import { CloudService } from '../../../services/cloud.service';
import { SpotifyService } from '../../../services/spotify.service';
import { PlaylistsObject } from '../../../models/spotify.model';
import { lastValueFrom } from 'rxjs';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-dialog-remove-playlist',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './dialog-remove-playlist.component.html',
  styleUrl: './dialog-remove-playlist.component.scss',
})
export class DialogRemovePlaylistComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogRemovePlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogRemovePlaylistData,
    private spotifyService: SpotifyService,
    private cloudService: CloudService,
    public navigationService: NavigationService
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async removePlaylist(): Promise<void> {
    try {
      await lastValueFrom(this.spotifyService.unfollowPlaylist(this.data.id));
      await this.updatePlaylists();
      this.onNoClick();
      const currentUrl = this.navigationService.getCurrentUrl();
      const isPlaylistInUrl = (playlistId: string) =>
        currentUrl.includes(playlistId);
      if (isPlaylistInUrl(this.data.id)) {
        this.navigationService.home();
      }
    } catch (error) {
      console.error('Error removing playlist:', error);
    }
  }

  private async updatePlaylists(): Promise<void> {
    try {
      const updatedPlaylists: PlaylistsObject = await lastValueFrom(
        this.spotifyService.getCurrentUsersPlaylists()
      );
      this.cloudService.setMyPlaylists(updatedPlaylists);
    } catch (error) {
      console.error('Error updating playlists:', error);
    }
  }
}
