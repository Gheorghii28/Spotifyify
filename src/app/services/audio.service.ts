import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import moment from 'moment';
import { StreamState } from '../models/stream-state.model';
import { CloudFiles } from '../models/cloud.model';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private stop$ = new Subject();
  private audioObj = new Audio();
  private state: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: 0,
    currentTime: 0,
    canplay: false,
    error: false,
  };
  private state$: BehaviorSubject<StreamState> = new BehaviorSubject(
    this.state
  );
  private currentPlaylistId!: string;
  private currentPlaylistId$: BehaviorSubject<string> = new BehaviorSubject(
    this.currentPlaylistId
  );
  private trackIndex!: number;
  private trackIndex$: BehaviorSubject<number> = new BehaviorSubject(
    this.trackIndex
  );
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

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case 'playing':
        this.state.playing = true;
        break;
      case 'pause':
        this.state.playing = false;
        break;
      case 'timeupdate':
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        break;
      case 'error':
        this.resetState();
        this.state.error = true;
        break;
    }
    this.state$.next(this.state);
  }

  private resetState(): void {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: 0,
      currentTime: 0,
      canplay: false,
      error: false,
    };
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

  public playStream(url: string, playListId: string): Observable<any> {
    this.currentPlaylistId$.next(playListId);
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  public togglePlayPause(): void {
    if (this.state.playing) {
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

  private formatTime(time: number, format: string = 'mm:ss'): string {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  public getState(): Observable<StreamState> {
    return this.state$.asObservable();
  }

  public getCurrentPlaylistId(): Observable<string> {
    return this.currentPlaylistId$.asObservable();
  }

  public getTrackIndex(): Observable<number> {
    return this.trackIndex$.asObservable();
  }

  public async setTrackIndex(index: number): Promise<void> {
    this.trackIndex$.next(index);
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