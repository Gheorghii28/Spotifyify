import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { StreamState } from '../models/stream-state.model';
import { CloudFiles, TrackFile } from '../models/cloud.model';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
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
  private initialTrackFile: TrackFile = {
    name: "",
    albumName: "",
    artists: [],
    durationMs: 0,
    id: "",
    previewUrl: "",
    index: 0,
    img: "",
    likedStatus: false,
    uri: "",
    playlistId: undefined,
    albumId: undefined,
  };
  state: WritableSignal<StreamState> = signal(this.initialState);
  currentPlayingTrack: WritableSignal<TrackFile> = signal(this.initialTrackFile);
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
  repeatMode: WritableSignal<number> = signal(0);
  isShuffled: WritableSignal<boolean> = signal(false);

  public async getNextTrack(
    index: number,
    files: CloudFiles
  ): Promise<TrackFile> {
    const nextIndex = index + 1 >= files.tracks.length ? 0 : index + 1;
    return await this.getPlayingTrack(files, nextIndex);
  }

  public async changeTrackIndex(
    direction: 'next' | 'previous',
    index?: number,
    files?: CloudFiles
  ): Promise<void> {
    let trackIndex: number = index || 0;
    trackIndex += direction === 'next' ? 1 : -1;
    const track: TrackFile = await this.getPlayingTrack(
      files as CloudFiles,
      trackIndex
    );
    this.currentPlayingTrack.set(track);
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

  private resetState(): void {
    this.state.set(this.initialState);
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

  private addEvents(obj: any, events: any, handler: any): void {
    events.forEach((event: any) => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: any, events: any, handler: any): void {
    events.forEach((event: any) => {
      obj.removeEventListener(event, handler);
    });
  }

  public playStream(url: string): Observable<any> {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  public togglePlayPause(): void {
    if (this.state().playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  public getFileUrl(files: CloudFiles, trackIndex: number): string {
    if (trackIndex === undefined) {
      trackIndex = 0;
    }
    return files.tracks[trackIndex].previewUrl;
  }

  getTrackId(files: CloudFiles, trackIndex: number): string {
    if (trackIndex === undefined) {
      trackIndex = 0;
    }
    return files.tracks[trackIndex].id;
  }

  public play(): void {
    this.audioObj.play();
  }

  public pause(): void {
    this.audioObj.pause();
  }

  public stop(): void {
    this.stop$.next(null);
  }

  public seekTo(seconds: number): void {
    this.audioObj.currentTime = seconds;
  }

  private formatTime(time: number, formatString: string = 'mm:ss'): string {
    const date = new Date(time * 1000);
    const zonedDate = toZonedTime(date, 'UTC');
    return format(zonedDate, formatString);
  }

  public setRepeatMode(mode: number): void {
    this.repeatMode.set(mode);
  }

  public setIsShuffled(isShuffled: boolean): void {
    this.isShuffled.set(isShuffled);
  }

  public async setPlayingTrack(track: TrackFile): Promise<void> {
    this.currentPlayingTrack.set(track);
  }

  public async getPlayingTrack(
    files: CloudFiles,
    index: number
  ): Promise<TrackFile> {
    const track: TrackFile = files.tracks[index];
    return track;
  }

  public getVolume(): number {
    return this.audioObj.volume;
  }

  public setVolume(volume: number): void {
    if (volume >= 0 && volume <= 1) {
      this.audioObj.volume = volume;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class NullAudioService {
  observeStreamState(): Observable<StreamState> {
    return of({
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: 0,
      currentTime: 0,
      canplay: false,
      error: false,
    });
  }

  observePlayingTrack(): Observable<TrackFile> {
    return of(null as unknown as TrackFile);
  }

  playStream(url: string): Observable<any> {
    return of(null);
  }

  togglePlayPause(): void {}
  play(): void {}
  pause(): void {}
  stop(): void {}
  seekTo(seconds: number): void {}
  setPlayingTrack(track: TrackFile): void {}
  getPlayingTrack(files: CloudFiles, index: number): TrackFile {
    return null as unknown as TrackFile;
  }
  getVolume(): number {
    return 0;
  }
  setVolume(volume: number): void {}
}
