import { Injectable } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { UserFirebaseData, UserFolder } from '../../models/firebase.model';
import { Artist, Playlist, PlaylistsObject, Track, TracksObject } from '../../models/spotify.model';
import { lastValueFrom } from 'rxjs';
import { SpotifyService } from '../../services/spotify.service';
import { CloudService } from '../../services/cloud.service';
import { TrackFile, TrackFileClass } from '../../models/cloud.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistManagerService {

  constructor(
    private firebaseService: FirebaseService,
    private spotifyService: SpotifyService,
    private cloudService: CloudService,
  ) { }

  findUnassignedPlaylists(
    userFirebaseData: UserFirebaseData,
    myPlaylists: PlaylistsObject
  ): Playlist[] {
    const folderAssignedPlaylistIds = new Set<string>();

    userFirebaseData.folders.forEach((folder: UserFolder) => {
      folder.playlists.forEach((assignedPlaylist: Playlist) => {
        folderAssignedPlaylistIds.add(assignedPlaylist.id);
      });
    });
    
    return myPlaylists.items?.filter(
      (playlist) => !folderAssignedPlaylistIds.has(playlist.id)
    ) || [];
  }

  updateFirebaseWithMyPlaylists(
    userId: string,
    userFirebaseData: UserFirebaseData,
    myPlaylists: PlaylistsObject
  ): void {
    const items: Playlist[] = myPlaylists.items;

    userFirebaseData.folders.forEach((folder: UserFolder) => {
      folder.playlists.forEach((playlist: Playlist) => {
        const matched = items.find((item) => item.id === playlist.id);
        if (matched?.tracks) {
          playlist.tracks.total = matched.tracks.total;
        }
      });
    });

    this.firebaseService.updateDocument('users', userId, {
      folders: [...userFirebaseData.folders],
    });
  }
  
  removePlaylistFromAllFolders(userData: UserFirebaseData, playlistId: string): UserFolder[] {
    return userData.folders.map(folder => ({
      ...folder,
      playlists: folder.playlists.filter(pl => pl.id !== playlistId)
    }));
  }

  updateUserPlaylists(userFirebaseData: UserFirebaseData, myPlaylists: PlaylistsObject): Playlist[] {
    this.updateFirebaseWithMyPlaylists(
      userFirebaseData.userId,
      userFirebaseData,
      myPlaylists
    );
    const folderUnassignedPlaylists = this.findUnassignedPlaylists(
      userFirebaseData,
      myPlaylists
    );
    return folderUnassignedPlaylists;
  }

  async setMyPlaylists(): Promise<void> {
    const playlists: PlaylistsObject = await lastValueFrom(
      this.spotifyService.getCurrentUsersPlaylists()
    );
    this.cloudService.myPlaylists.set(playlists);
  }

  async setMyTracks(): Promise<void> {
    const tracks: TracksObject = await lastValueFrom(
      this.spotifyService.getUsersSavedTracks()
    );
    this.cloudService.myTracks.set(tracks);
  }

  async loadUserDefaultTrack(): Promise<TrackFile> {
    const response: TracksObject = await lastValueFrom(
      this.spotifyService.getUsersSavedTracks()
    );
    const track: Track = response.items[0].track;
    const playingTrack = new TrackFileClass(track, 0, '', undefined);
    return playingTrack;
  }

  async loadArtists(track: TrackFile): Promise<Artist[]> {
    const artistIds: string[] = track.artists.map(
      (artist: { name: string; id: string }) => artist.id
    );
    const artistResults = await lastValueFrom(
      this.spotifyService.getArtist(artistIds)
    );
    const artists = artistResults.artists;
    return artists;
  }

  async loadPlaylist(playlistId: string): Promise<Playlist> {
    const response: Playlist = await lastValueFrom(
      this.spotifyService.getPlaylist(playlistId)
    );
    return response;
  }
}
