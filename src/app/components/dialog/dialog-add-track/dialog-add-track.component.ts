import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogAddTrackData } from '../../../models/dialog.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { lastValueFrom } from 'rxjs';
import { Playlist } from '../../../models';
import { SpotifyService } from '../../../services';
import { PlaylistManagerService } from '../../../layout/services/playlist-manager.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-dialog-add-track',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './dialog-add-track.component.html',
  styleUrl: './dialog-add-track.component.scss',
})
export class DialogAddTrackComponent {
  private spotifyService = inject(SpotifyService);
  private playlistManager = inject(PlaylistManagerService);
  private snackbar = inject(SnackbarService);

  playlistControl = new FormControl<Playlist | null>(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  constructor(
    public dialogRef: MatDialogRef<DialogAddTrackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogAddTrackData,
  ) { }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async addTrack(playlistId: string): Promise<void> {
    try {
      await lastValueFrom(
        this.spotifyService.addItemsToPlaylist(
          playlistId, 
          {uri: this.data.uri, position: this.data.position}
        )
      );
      await this.snackbar.runWithSnackbar(
        this.playlistManager.addTrackToPlaylist(playlistId, this.data.track),
        `Track added to playlist successfully!`
      );
      this.dialogRef.close();
    } catch (error) {
      console.error('Error adding item to playlist:', error);
    }
  }

  public get myPlaylists(): Playlist[] {
    return this.playlistManager.myPlaylists()!;
  }
}
