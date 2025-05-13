import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogRemoveTrackData } from '../../../models/dialog.model';
import { lastValueFrom } from 'rxjs';
import { SpotifyService } from '../../../services';
import { PlaylistManagerService } from '../../../layout/services/playlist-manager.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-dialog-remove-track',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './dialog-remove-track.component.html',
  styleUrl: './dialog-remove-track.component.scss',
})
export class DialogRemoveTrackComponent {
  private spotifyService = inject(SpotifyService);
  private playlistManager = inject(PlaylistManagerService);
  private snackbar = inject(SnackbarService);

  constructor(
    public dialogRef: MatDialogRef<DialogRemoveTrackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogRemoveTrackData,
  ) { }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async removeTrack(): Promise<void> {
    try {
      await lastValueFrom(
        this.spotifyService.removePlaylisItems(this.data.playlistId, this.data)
      );
      await this.snackbar.runWithSnackbar(
        this.playlistManager.removeTrackFromPlaylist(this.data.playlistId, this.data.trackId),
        'Track removed from playlist successfully!'
      );
      this.dialogRef.close();
    } catch (error) {
      console.error('Error removing track:', error);
    }
  }
}
