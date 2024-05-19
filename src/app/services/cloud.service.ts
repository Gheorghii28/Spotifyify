import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
  CloudFiles,
  CloudFilesClass,
  TrackFile,
  TrackFileClass,
} from '../models/cloud.model';
import { Playlist } from '../models/spotify.model';
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
  };
  private files$: BehaviorSubject<any> = new BehaviorSubject(this.initialFiles);

  constructor(private spotifyService: SpotifyService) {}

  public observeFiles(): Observable<any> {
    return this.files$.asObservable();
  }

  public setFiles(newFiles: CloudFiles): void {
    this.files$.next(newFiles);
  }

  public async getFiles(playListId: string): Promise<CloudFiles> {
    const playList: Playlist = await this.spotifyService.getSpotifyData(
      `playlists/${playListId}`
    );
    const tracks: TrackFile[] = this.extractPlayableTracks(playList);
    tracks.forEach(async (track: TrackFile) => {
      track.likedStatus = await this.spotifyService.fetchLikedStatusForTrack(
        track.id
      );
    });
    const files: CloudFiles = new CloudFilesClass(playList, tracks);
    return files;
  }

  private extractPlayableTracks(playList: Playlist): TrackFile[] {
    return playList.tracks.items
      .filter((item) => item.track && item.track.preview_url)
      .map((item, index) => new TrackFileClass(item.track, index, playList.id));
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
