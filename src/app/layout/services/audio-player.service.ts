import { Injectable } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { CloudFiles, TrackFile } from '../../models/cloud.model';
import { Observable } from 'rxjs';
import { StreamState } from '../../models/stream-state.model';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {

  constructor(
    private audioService: AudioService,
  ) { }
  
  playAudio(track: TrackFile, files: CloudFiles, onEnded: () => void): void {
    this.audioService.stop();
    const url = this.getTrackUrl(track, files);
    this.audioService.playStream(url).subscribe((event) => {
      if (event.type === 'ended') {
        onEnded();
      }
    });
  }

  getTrackUrl(track: TrackFile, files: CloudFiles): string {
    return track.playlistId
      ? this.audioService.getFileUrl(files, track.index)
      : track.previewUrl;
  }

  async handleTrackEnd(
    playingTrack: TrackFile,
    files: CloudFiles,
    repeatMode: number,
    isShuffled: boolean,
    isLastPlaying: boolean
  ): Promise<TrackFile | null> {
    if (repeatMode === 2) {
      return playingTrack;
    }

    if (isShuffled) {
      const index = this.getRandomTrackIndex(files);
      return this.audioService.getPlayingTrack(files, index);
    }

    if (!isLastPlaying) {
      return this.audioService.getNextTrack(playingTrack.index, files);
    }

    if (repeatMode === 1) {
      return files.tracks[0];
    }

    return null;
  }

  getRandomTrackIndex(files: CloudFiles): number {
    return Math.floor(Math.random() * files.tracks.length);
  }

  observeState(): Observable<StreamState> {
    return this.audioService.observeStreamState();
  }

  observeRepeatMode(): Observable<number> {
    return this.audioService.observeRepeatMode();
  }

  observeShuffled(): Observable<boolean> {
    return this.audioService.observeIsShuffled();
  }

  observePlayingTrack(): Observable<TrackFile> {
    return this.audioService.observePlayingTrack();
  }

  setPlayingTrack(track: TrackFile): void {
    this.audioService.setPlayingTrack(track);
  }

  async handleTrackPlaybackEnd(
    playingTrack: TrackFile,
    files: CloudFiles,
    repeatMode: number,
    isShuffled: boolean,
    isLastPlaying: boolean
  ): Promise<void> {
    const nextTrack = await this.handleTrackEnd(
      playingTrack,
      files,
      repeatMode,
      isShuffled,
      isLastPlaying
    );
  
    if (nextTrack) {
      this.setPlayingTrack(nextTrack);
    }
  }  
}
