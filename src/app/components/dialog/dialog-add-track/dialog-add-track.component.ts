import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogAddTrackData } from '../../../models/dialog.model';
import { SpotifyService } from '../../../services/spotify.service';
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
import { Playlist, PlaylistsObject } from '../../../models/spotify.model';
import { lastValueFrom, Subscription } from 'rxjs';
import { CloudService } from '../../../services/cloud.service';

@Component({
  selector: 'app-dialog-add-track',
  standalone: true,
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
  playlistControl = new FormControl<Playlist | null>(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  playlists: Playlist[] = [];
  myPlaylists!: PlaylistsObject;
  private myPlaylistsSubscription!: Subscription;
  constructor(
    public dialogRef: MatDialogRef<DialogAddTrackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogAddTrackData,
    private spotifyService: SpotifyService,
    private cloudService: CloudService
  ) {}

  ngOnInit() {
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.myPlaylistsSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.myPlaylistsSubscription = this.cloudService
      .observeMyPlaylists()
      .subscribe((playlistObj: PlaylistsObject) => {
        this.myPlaylists = playlistObj;
        this.playlists = playlistObj.items;
      });
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async addTrack(playlistId: string): Promise<void> {
    try {
      await lastValueFrom(
        this.spotifyService.addItemsToPlaylist(playlistId, this.data)
      );
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error adding item to playlist:', error);
    }
  }
}
