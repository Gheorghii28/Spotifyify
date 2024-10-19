import { Injectable } from '@angular/core';
import { SpotifyService } from './spotify.service';
import { CloudService } from './cloud.service';
import { CloudFiles, TrackFile } from '../models/cloud.model';
import { lastValueFrom } from 'rxjs';
import { TracksObject } from '../models/spotify.model';

@Injectable({
  providedIn: 'root'
})
export class LikedStatusService {

  constructor(
    private spotifyService: SpotifyService, 
    private cloudService: CloudService
  ) { }

  private async updateLikedStatus(
    trackId: string,
    newStatus: boolean
  ): Promise<void> {
    const currentFiles = (await this.cloudService.getCurrentFiles()) as CloudFiles;
    if (currentFiles) {
      const track = currentFiles.tracks.find(
        (track: TrackFile) => track.id === trackId
      );
      if (track) {
        track.likedStatus = newStatus;
        this.cloudService.setFiles(currentFiles);
      }
    }
  }

  public async saveTrack(id: string): Promise<void> {
    try {
      await lastValueFrom(this.spotifyService.saveTracksForCurrentUser(id));
    } catch (error) {
      console.error('Error saving track:', error);
    }
  }

  public async removeTrack(id: string): Promise<void> {
    try {
      await lastValueFrom(this.spotifyService.removeUsersSavedTracks(id));
    } catch (error) {
      console.error('Error removing track:', error);
    }
  }

  public async checkAndUpdateLikedStatus(id: string, playingTrack?: any): Promise<void> {
    const likedStatusArr: boolean[] = await lastValueFrom(
      this.spotifyService.checkUsersSavedTracks([id])
    );
    const likedStatus = likedStatusArr[0];

    if (playingTrack && id === playingTrack.id) {
      playingTrack.likedStatus = likedStatus;
    }

    this.updateLikedStatus(id, likedStatus);
  }

  public async updateUserSavedTracks(): Promise<void> {
    const tracks: TracksObject = await lastValueFrom(
      this.spotifyService.getUsersSavedTracks()
    );
    this.cloudService.setMyTracks(tracks);
  }
}
