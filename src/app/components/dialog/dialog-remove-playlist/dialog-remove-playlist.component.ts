import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogRemovePlaylistData } from '../../../models/dialog.model';
import { CloudService } from '../../../services/cloud.service';
import { SpotifyService } from '../../../services/spotify.service';
import { Router } from '@angular/router';
import { PlaylistsObject } from '../../../models/spotify.model';

@Component({
  selector: 'app-dialog-remove-playlist',
  standalone: true,
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
    private router: Router
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async removePlaylist(): Promise<void> {
    const currentUrl = this.router.url;
    if (this.isPlaylistInUrl(currentUrl, this.data.id)) {
      this.router.navigate(['/home']);
    }
    const removalResponse = await this.spotifyService.removeSpotifyData(
      `playlists/${this.data.id}/followers`
    );
    this.onNoClick();
    this.updatePlaylists();
  }

  private async updatePlaylists(): Promise<void> {
    const updatedPlaylists: PlaylistsObject =
      await this.spotifyService.retrieveSpotifyData(`me/playlists`);
    this.cloudService.setMyPlaylists(updatedPlaylists);
  }

  private isPlaylistInUrl(url: string, id: string): boolean {
    return url.includes(id);
  }
}
