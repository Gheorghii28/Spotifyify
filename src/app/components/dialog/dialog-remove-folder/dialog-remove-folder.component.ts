import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from '../../../services/firebase.service';
import { CloudService } from '../../../services/cloud.service';
import { SpotifyService } from '../../../services/spotify.service';
import { PlaylistsObject } from '../../../models/spotify.model';
import { DialogRemoveFolderData } from '../../../models/dialog.model';
import { UserFolder } from '../../../models/firebase.model';
import { lastValueFrom } from 'rxjs';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-dialog-remove-folder',
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
    public navigationService: NavigationService
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async removeFolderAndCleanUp(): Promise<void> {
    try {
      const folderToRemove: UserFolder = this.data.folder;
      const folders: UserFolder[] = this.data.userFirebaseData.folders.filter(
        (folder: UserFolder) => folder.id !== folderToRemove.id
      );
      await this.firebaseService.updateDocument(
        'users',
        this.data.userFirebaseData.userId,
        { folders: folders }
      );
      await Promise.all(
        folderToRemove.playlists.map((playlist) =>
          this.removePlaylist(playlist.id)
        )
      );
      await this.updatePlaylists();
      this.onNoClick();
      if (this.isCurrentPlaylistInDeletedFolder(folderToRemove)) {
        this.navigationService.home();
      }
    } catch (error) {
      console.error('Error removing folder:', error);
    }
  }

  private async removePlaylist(playlistId: string): Promise<void> {
    try {
      await lastValueFrom(this.spotifyService.unfollowPlaylist(playlistId));
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

  private isCurrentPlaylistInDeletedFolder(
    folderToRemove: UserFolder
  ): boolean {
    const currentUrl = this.navigationService.getCurrentUrl();
    const isPlaylistInUrl = (playlistId: string) =>
      currentUrl.includes(playlistId);
    return folderToRemove.playlists.some((playlist) =>
      isPlaylistInUrl(playlist.id)
    );
  }
}
