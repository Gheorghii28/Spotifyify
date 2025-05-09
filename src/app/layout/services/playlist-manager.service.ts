import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Artist, Playlist, Track } from '../../models';
import { UserFolder } from '../../models/user.model';
import { DialogChangePlaylistDetailsData } from '../../models/dialog.model';
import { FirebaseService, SpotifyService, UtilsService } from '../../services';

@Injectable({
  providedIn: 'root'
})
export class PlaylistManagerService {
  private firebaseService = inject(FirebaseService);
  private spotifyService = inject(SpotifyService);
  private utilsService = inject(UtilsService);
  myPlaylists: WritableSignal<Playlist[]> = signal([]);
  folders: WritableSignal<UserFolder[]> = signal([]);
  assignedPlaylists: Signal<Playlist[]> = computed(() => {
    return this.folders().reduce((acc: Playlist[], folder: UserFolder) => {
      return [...acc, ...folder.playlists];
    }, []);
  });
  unassignedPlaylists: Signal<Playlist[]> = computed(() => {
    const assignedIds = new Set(
      this.folders()
        .flatMap(folder => folder.playlists)
        .map(playlist => playlist.id)
    );
    return this.myPlaylists().filter(p => !assignedIds.has(p.id));
  });

  async setMyPlaylists(): Promise<void> {
    const playlists: Playlist[] = await lastValueFrom(
      this.spotifyService.getUsersPlaylists()
    );
    this.myPlaylists.set(playlists);
  }

  async loadArtists(track: Track): Promise<Artist[]> {
    const artistIds: string[] = track.artists.map(
      (artist: { name: string; id: string }) => artist.id
    );
    const artistResults = await lastValueFrom(
      this.spotifyService.getArtist(artistIds)
    );
    const artists = artistResults;
    return artists;
  }

  async loadPlaylist(playlistId: string): Promise<Playlist> {
    const response: Playlist = await lastValueFrom(
      this.spotifyService.getPlaylist(playlistId)
    );
    return response;
  }

  public async removePlaylist(userId: string, playlistId: string): Promise<void> {
    await lastValueFrom(
      this.spotifyService.unfollowPlaylist(playlistId)
    );
    await this.updateFolders(userId, folders =>
      folders.map(folder => ({
        ...folder,
        playlists: folder.playlists.filter(p => p.id !== playlistId),
      }))
    );
    this.myPlaylists.update(playlists =>
      playlists.filter(playlist => playlist.id !== playlistId)
    );
  }

  public async createPlaylist(userId: string): Promise<void> {
    const playlistNr: number = this.myPlaylists().length + 1;
    const newPlaylist = await lastValueFrom(
      this.spotifyService.createPlaylist(userId, playlistNr)
    );
    this.myPlaylists.update(playlists => [...playlists, newPlaylist]);
  }

  public async changePlaylistDetails(details: DialogChangePlaylistDetailsData): Promise<void> {
    await lastValueFrom(
      this.spotifyService.changePlaylistDetails(details)
    );
    this.myPlaylists.update(playlists =>
      playlists.map(playlist =>
        playlist.id === details.id
          ? { ...playlist, name: details.name, description: details.description }
          : playlist
      )
    );
  }

  private async updateFolders(
    userId: string,
    updater: (folders: UserFolder[]) => UserFolder[]
  ): Promise<void> {
    const updatedFolders = updater(this.folders());
    await this.firebaseService.updateDocument('users', userId, {
      folders: updatedFolders,
    });
  }

  public async createPlaylistFolder(userId: string): Promise<void> {
    const folderId = this.utilsService.randomString(11);
    await this.updateFolders(userId, folders => [
      ...folders,
      { id: folderId, name: 'New Folder', playlists: [] },
    ]);
  }

  public async removePlaylistFolder(
    userId: string,
    folderId: string
  ): Promise<void> {
    await this.updateFolders(userId, folders =>
      folders.filter(folder => folder.id !== folderId)
    );
  }

  public async renamePlaylistFolder(
    userId: string,
    folderId: string,
    newName: string
  ): Promise<void> {
    await this.updateFolders(userId, folders =>
      folders.map(folder =>
        folder.id === folderId ? { ...folder, name: newName } : folder
      )
    );
  }

  public updatePlaylistInFolder(
    folders: UserFolder[],
    playlist: Playlist,
    folderId: string | null,
    userId: string,
    action: 'add' | 'remove'
  ): void {
    if (action === 'add') {
      if (!folderId) return; // Without a valid folder ID, nothing can be added

      folders.forEach((folder) => {
        if (folder.id === folderId) {
          const exists = folder.playlists.some(pl => pl.id === playlist.id);
          if (!exists) {
            folder.playlists.push(playlist);
          }
        }
      });
    }

    if (action === 'remove') {
      if (!folderId) {
        // Remove from all folders
        folders.forEach(folder => {
          folder.playlists = folder.playlists.filter(pl => pl.id !== playlist.id);
        });
      } else {
        // Remove from a specific folder only
        folders.forEach(folder => {
          if (folder.id === folderId) {
            folder.playlists = folder.playlists.filter(pl => pl.id !== playlist.id);
          }
        });
      }
    }

    this.firebaseService.updateDocument('users', userId, {
      folders: folders,
    });
  }

  public addTrackToPlaylist(playlistId: string, newTrack: Track): void {
    this.myPlaylists.update(playlists =>
      playlists.map(playlist => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            tracks: [...playlist.tracks, newTrack],
            totalTracks: playlist.totalTracks + 1,
          };
        }
        return playlist;
      })
    );
  }

  public removeTrackFromPlaylist(playlistId: string, trackId: string): void {
    this.myPlaylists.update(playlists =>
      playlists.map(playlist => {
        if (playlist.id === playlistId) {
          const filteredTracks = playlist.tracks.filter(track => track.id !== trackId);
          return {
            ...playlist,
            tracks: filteredTracks,
            totalTracks: filteredTracks.length,
          };
        }
        return playlist;
      })
    );
  }
}
