import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogRemoveTrackData } from '../../../models/dialog.model';
import { SpotifyService } from '../../../services/spotify.service';

@Component({
  selector: 'app-dialog-remove-track',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './dialog-remove-track.component.html',
  styleUrl: './dialog-remove-track.component.scss',
})
export class DialogRemoveTrackComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogRemoveTrackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogRemoveTrackData,
    private spotifyService: SpotifyService
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async removeTrack(): Promise<void> {
    try {
      const body = {
        snapshot_id: this.data.snapshot_id,
        tracks: [
          {
            uri: this.data.uri,
          },
        ],
      };
      const removalResponse = await this.spotifyService.removeSpotifyData(
        `playlists/${this.data.playlistId}/tracks`,
        body
      );
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error while deleting the track:', error);
    }
  }
}
