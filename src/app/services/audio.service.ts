import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { StreamState } from '../models/stream-state.model';
import { Playlist, Track } from '../models';
import { SpotifyService } from './spotify.service';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private spotifyService = inject(SpotifyService);
  private stop$ = new Subject();
  private audioObj = new Audio();
  private initialState: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: 0,
    currentTime: 0,
    canplay: false,
    error: false,
  };
  state: WritableSignal<StreamState> = signal(this.initialState);
  private audioEvents = [
    'ended',
    'error',
    'play',
    'playing',
    'pause',
    'timeupdate',
    'canplay',
    'loadedmetadata',
    'loadstart',
  ];
  playingTrack: WritableSignal<Track | null> = signal(null);
  playingPlaylist: WritableSignal<Track[]> = signal([]);
  repeatMode: WritableSignal<'off' | 'track' | 'playlist'> = signal('off');
  currentIndex: WritableSignal<number> = signal(-1);
  isShuffle: WritableSignal<boolean> = signal(false);

  public playStream(url: string): Observable<any> {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  private streamObservable(url: any): Observable<Event> {
    return new Observable((observer) => {
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        this.resetState();
      };
    });
  }

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this.state().duration = this.audioObj.duration;
        this.state().readableDuration = this.formatTime(this.state().duration);
        this.state().canplay = true;
        break;
      case 'playing':
        this.state().playing = true;
        break;
      case 'pause':
        this.state().playing = false;
        break;
      case 'timeupdate':
        this.state().currentTime = this.audioObj.currentTime;
        this.state().readableCurrentTime = this.formatTime(
          this.state().currentTime
        );
        break;
      case 'error':
        this.resetState();
        this.state().error = true;
        break;
    }
    this.state.set(this.state());
  }

  private addEvents(obj: any, events: any, handler: any): void {
    events.forEach((event: any) => {
      obj.addEventListener(event, handler);
    });
  }

  private resetState(): void {
    this.state.set(this.initialState);
  }

  private removeEvents(obj: any, events: any, handler: any): void {
    events.forEach((event: any) => {
      obj.removeEventListener(event, handler);
    });
  }

  public togglePlayPause(): void {
    if (this.state().playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  private play(): void {
    this.audioObj.play();
  }

  private pause(): void {
    this.audioObj.pause();
  }

  public stop(): void {
    this.stop$.next(null);
  }

  public seekTo(seconds: number): void {
    this.audioObj.currentTime = seconds;
  }

  public setVolume(volume: number): void {
    if (volume >= 0 && volume <= 1) {
      this.audioObj.volume = volume;
    }
  }

  private formatTime(time: number, formatString: string = 'mm:ss'): string {
    const date = new Date(time * 1000);
    const zonedDate = toZonedTime(date, 'UTC');
    return format(zonedDate, formatString);
  }

  // Prepare the track (e.g., set previewUrl, attach playlistId) and play it
  public async prepareAndPlayTrack(
    playlist: Playlist,
    track: Track
  ): Promise<void> {
    this.setPlaylistIdForTracksIfMissing(track, playlist);
    await this.setPreviewUrlToTrack(track);
    this.currentIndex.set(track.index);
    this.handlePlayAudio(playlist, track);
  }

  private setPlaylistIdForTracksIfMissing(track: Track, playlist: Playlist): void {
    if (!track.playlistId || playlist.id !== this.playingTrack()?.playlistId) {
      playlist.tracks.forEach(t => {
        t.playlistId = playlist.id;
      });
    }
  }

  private async setPreviewUrlToTrack(track: Track): Promise<void> {
    if (!track.previewUrl) {
      track.previewUrl = await firstValueFrom(
        this.spotifyService.getTrackPreviewUrl(track.id)
      );
    }
  }

  private async handlePlayAudio(playlist: Playlist, track: Track): Promise<void> {
    if (
      this.playingTrack() &&
      this.playingTrack()?.id === track.id &&
      this.playingTrack()?.playlistId === playlist.id
    ) {
      this.togglePlayPause();
      return;
    }
    this.playingPlaylist.set(playlist.tracks);
    this.playingTrack.set(track);
  }

  public toggleRepeatMode(): void {
    this.repeatMode.update(mode => {
      if (mode === 'off') return 'track';
      if (mode === 'track') return 'playlist';
      return 'off';
    });
  }

  public toggleShuffle(): void {
    this.isShuffle.update(value => !value);
  }

  public nextTrack(): void {
    const tracks = this.playingPlaylist();
    if (tracks.length === 0) return;

    const shuffle = this.isShuffle();
    const repeat = this.repeatMode();

    if (shuffle) {
      this.playRandomTrack();
      return;
    }

    let nextIndex = this.currentIndex() + 1;

    if (nextIndex >= tracks.length) {
      if (repeat === 'playlist') {
        nextIndex = 0; // Start again from the beginning
      } else {
        this.stop(); // Stop if repeat is disabled
        return;
      }
    }

    this.setplayingTrackByIndex(nextIndex);
  }

  public previousTrack(): void {
    const tracks = this.playingPlaylist();
    if (tracks.length === 0) return;

    let previousIndex = this.currentIndex() - 1;

    if (previousIndex < 0) {
      previousIndex = this.isShuffle() ? Math.floor(Math.random() * tracks.length) : tracks.length - 1;
    }

    this.setplayingTrackByIndex(previousIndex);
  }

  private playRandomTrack() {
    const tracks = this.playingPlaylist();
    if (tracks.length === 0) return;

    let randomIndex = Math.floor(Math.random() * tracks.length);

    // Avoid replaying the same track
    if (tracks.length > 1 && randomIndex === this.currentIndex()) {
      randomIndex = (randomIndex + 1) % tracks.length;
    }

    this.setplayingTrackByIndex(randomIndex);
  }

  private async setplayingTrackByIndex(index: number): Promise<void> {
    const tracks = this.playingPlaylist();
    if (tracks.length === 0) return;

    const safeIndex = Math.max(0, Math.min(index, tracks.length - 1));
    this.currentIndex.set(safeIndex);
    this.stop();
    await this.setPreviewUrlToTrack(tracks[safeIndex]);
    this.playingTrack.set(tracks[safeIndex]);
  }

  // IMPORTANT: Call this function when the track has finished playing
  public onTrackEnded(): void {
    const repeat = this.repeatMode();
    if (repeat === 'track') {
      this.play();
    } else {
      this.nextTrack();
    }
  }
}