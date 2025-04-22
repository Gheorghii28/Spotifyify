import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogRemoveTrackData } from '../../../models/dialog.model';
import { SpotifyService } from '../../../services/spotify.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dialog-remove-track',
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
      await lastValueFrom(
        this.spotifyService.removePlaylisItems(this.data.playlistId, this.data)
      );
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error removing track:', error);
    }
  }
}
