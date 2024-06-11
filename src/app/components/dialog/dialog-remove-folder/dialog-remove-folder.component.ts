import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from '../../../services/firebase.service';
import { Router } from '@angular/router';
import { CloudService } from '../../../services/cloud.service';
import { SpotifyService } from '../../../services/spotify.service';
import { Playlist, PlaylistsObject } from '../../../models/spotify.model';
import { DialogRemoveFolderData } from '../../../models/dialog.model';
import { UserFolder } from '../../../models/firebase.model';

@Component({
  selector: 'app-dialog-remove-folder',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './dialog-remove-folder.component.html',
  styleUrl: './dialog-remove-folder.component.scss',
})
export class DialogRemoveFolderComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogRemoveFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogRemoveFolderData,
    private firebaseService: FirebaseService,
    private spotifyService: SpotifyService,
    private cloudService: CloudService,
    private router: Router
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async removeFolder(): Promise<void> {
    const folderToRemove = this.data.folder;
    let folders = this.data.userFirebaseData.folders;
    folders = folders.filter(
      (folder: UserFolder) => folder.id !== folderToRemove.id
    );
    folderToRemove.playlists.forEach(async (playlist: Playlist) => {
      await this.removePlaylist(playlist.id);
    });
    await this.firebaseService.updateDocument(
      'users',
      this.data.userFirebaseData.userId,
      { folders: folders }
    );
    await this.updatePlaylists();
    this.onNoClick();
  }

  private async removePlaylist(playlistId: string): Promise<void> {
    const currentUrl = this.router.url;
    if (this.isPlaylistInUrl(currentUrl, playlistId)) {
      this.router.navigate(['/home']);
    }
    const removalResponse = await this.spotifyService.removeSpotifyData(
      `playlists/${playlistId}/followers`
    );
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
