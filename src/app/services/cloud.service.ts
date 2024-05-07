import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private files!: CloudFiles;
  private files$: BehaviorSubject<any> = new BehaviorSubject(this.files);

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
    const files: CloudFiles = new CloudFilesClass(playList, tracks);
    return files;
  }

  private extractPlayableTracks(playList: Playlist): TrackFile[] {
    return playList.tracks.items
      .filter((item) => item.track && item.track.preview_url)
      .map((item, index) => new TrackFileClass(item.track, index));
  }
}
