import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
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
  private files$: BehaviorSubject<any> = new BehaviorSubject(this.initialFiles);
  private myPlaylists$: BehaviorSubject<any> = new BehaviorSubject({});
  private myTracks$: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private spotifyService: SpotifyService) {}

  public observeFiles(): Observable<any> {
    return this.files$.asObservable();
  }

  public setFiles(newFiles: CloudFiles): void {
    this.files$.next(newFiles);
  }

  public observeMyPlaylists(): Observable<PlaylistsObject> {
    return this.myPlaylists$.asObservable();
  }

  public setMyPlaylists(newPlaylists: PlaylistsObject): void {
    this.myPlaylists$.next(newPlaylists);
  }

  public observeMyTracks(): Observable<TracksObject> {
    return this.myTracks$.asObservable();
  }

  public setMyTracks(newTracks: TracksObject): void {
    this.myTracks$.next(newTracks);
  }

  public getCurrentFiles(): Promise<CloudFiles> {
    return Promise.resolve(this.files$.getValue());
  }  

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
        .filter((item) => item.track && item.track.preview_url)
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
      this.setFiles(files);
      const playlists: PlaylistsObject = await lastValueFrom(
        this.spotifyService.getCurrentUsersPlaylists()
      );
      this.setMyPlaylists(playlists);
    }
  }

  public async addTrackToPlaylist(): Promise<void> {
    const playlists: PlaylistsObject = await lastValueFrom(
      this.spotifyService.getCurrentUsersPlaylists()
    );
    this.setMyPlaylists(playlists);
  }
}
