import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private initialFiles: CloudFiles = {
    name: '',
    description: '',
    followers: undefined,
    id: '',
    imageUrl: '',
    tracks: [],
    type: '',
    color: '',
    snapshot_id: ';',
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

  public async getFiles(playlistId: string): Promise<CloudFiles> {
    const playlist: Playlist = await this.spotifyService.getSpotifyData(
      `playlists/${playlistId}`
    );
    const tracks: TrackFile[] = this.extractPlayableTracks(playlist);
    tracks.forEach(async (track: TrackFile) => {
      track.likedStatus = await this.spotifyService.fetchLikedStatusForTrack(
        track.id
      );
    });
    const files: CloudFiles = new CloudFilesClass(playlist, tracks);
    return files;
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

  public async updateLikedStatus(
    trackId: string,
    newStatus: boolean
  ): Promise<void> {
    const currentFiles = (await this.files$.getValue()) as CloudFiles;
    if (currentFiles) {
      const track = currentFiles.tracks.find(
        (track: TrackFile) => track.id === trackId
      );
      if (track) {
        track.likedStatus = newStatus;
        this.setFiles(currentFiles);
      }
    }
  }
}
