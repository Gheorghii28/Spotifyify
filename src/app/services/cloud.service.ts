import { Injectable, signal, WritableSignal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {
  CloudFiles,
  CloudFilesClass,
  TrackFile,
  TrackFileClass,
} from '../models/cloud.model';
import {
  Playlist,
  PlaylistsObject,
  TracksObject,
} from '../models/spotify.model';
import { SpotifyService } from './spotify.service';
import { DialogChangePlaylistDetailsData } from '../models/dialog.model';

@Injectable({
  providedIn: 'root',
})
export class CloudService {
  public initialFiles: CloudFiles = {
    name: '',
    description: '',
    followers: undefined,
    id: '',
    imageUrl: '',
    tracks: [],
    type: '',
    color: '',
    snapshot_id: ';',
    isUserCreated: false,
  };
  initialMyPlaylists: PlaylistsObject = {
    href: '',
    items: [],
    limit: 0,
    next: '',
    offset: 0,
    previous: '',
    total: 0
  };
  initialMyTracks: TracksObject = {
    href: '',
    items: [],
    limit: 0,
    next: '',
    offset: 0,
    previous: '',
    total: 0
  }
  files: WritableSignal<CloudFiles> = signal(this.initialFiles); // TODO: Cloud files have to contain the liked songs, too. To be able to play them as playlist
  myPlaylists: WritableSignal<PlaylistsObject> = signal(this.initialMyPlaylists);
  myTracks: WritableSignal<TracksObject> = signal(this.initialMyTracks);
  constructor(private spotifyService: SpotifyService) {}

  public async getFiles(playlistId: string): Promise<CloudFiles> {
    try {
      const playlist: Playlist = await lastValueFrom(
        this.spotifyService.getPlaylist(playlistId)
      );
      const tracks: TrackFile[] = this.extractPlayableTracks(playlist).slice(
        0,
        50
      );
      const updatedTracks: TrackFile[] = await this.updateTrackLikedStatus(
        tracks
      );
      const files: CloudFiles = new CloudFilesClass(playlist, updatedTracks);
      return files;
    } catch (error) {
      console.error('Error getting files:', error);
      throw new Error('Failed to retrieve files.');
    }
  }

  private extractPlayableTracks(playlist: Playlist): TrackFile[] {
    if (playlist.tracks.items) {
      return playlist.tracks.items
        .filter((item) => item.track && item.track.preview_url === null) //spotify web api endpoint 30-second preview_url is nullable/deprecated
        .map(
          (item, index) =>
            new TrackFileClass(item.track, index, playlist.id, undefined)
        );
    }
    return [];
  }

  public async updateTrackLikedStatus(
    tracks: TrackFile[]
  ): Promise<TrackFile[]> {
    try {
      const trackIds: string[] = tracks.map((track) => track.id);
      if(trackIds.length > 0) {
        const likedStatuses: boolean[] = await lastValueFrom(
          this.spotifyService.checkUsersSavedTracks(trackIds)
        );
        const updatedTracks: TrackFile[] = tracks.map(
          (track: TrackFile, index: number) => {
            return {
              ...track,
              likedStatus: likedStatuses[index],
            };
          }
        );

        return updatedTracks;
      }
      
      return tracks;
    } catch (error) {
      console.error('Error updating track liked status:', error);
      throw new Error('Failed to update track liked status.');
    }
  }

  public updateTrackIndexesAndImage(files: CloudFiles): void {
    files.tracks.forEach((track: TrackFile, index: number) => {
      track.index = index;
    });
  
    files.imageUrl = files.tracks[0]?.img || '';
  }

  public async deleteTrackFromPlaylist(files: CloudFiles, trackFile: TrackFile): Promise<void> {
    const trackIndex = files.tracks.findIndex(
      (track) => track.id === trackFile.id
    );
    if (trackIndex !== -1) {
      files.tracks.splice(trackIndex, 1);
      this.updateTrackIndexesAndImage(files);
      this.files.set(files);
      const playlists: PlaylistsObject = await lastValueFrom(
        this.spotifyService.getCurrentUsersPlaylists()
      );
      this.myPlaylists.set(playlists);
    }
  }

  public async addTrackToPlaylist(): Promise<void> {
    const playlists: PlaylistsObject = await lastValueFrom(
      this.spotifyService.getCurrentUsersPlaylists()
    );
    this.myPlaylists.set(playlists);
  }

  public async updatePlaylistDetails(details: DialogChangePlaylistDetailsData): Promise<void> {
    try {
      const playlists: PlaylistsObject = await lastValueFrom(this.spotifyService.getCurrentUsersPlaylists());
      const newName = details.name.trim();
      const newDescription = details.description.trim();
      const playlistToUpdate = playlists.items.find((playlist) => playlist.id === details.id);
  
      if (playlistToUpdate && (playlistToUpdate.name !== newName || playlistToUpdate.description !== newDescription)) {
        playlistToUpdate.name = newName;
        playlistToUpdate.description = newDescription;
        this.myPlaylists.set(playlists);

        const currentFiles = this.files();
        if(details.id === currentFiles.id) {
          currentFiles.name = newName;
          currentFiles.description = newDescription;
          this.files.set(currentFiles);
        }
      } else {
        console.log('No changes detected or playlist not found.');
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  }
}
