import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutService } from '../../services/layout.service';
import { CloudFiles, TrackFile } from '../../models/cloud.model';
import { Subscription } from 'rxjs';
import { AudioService } from '../../services/audio.service';
import { CommonModule } from '@angular/common';
import { StreamState } from '../../models/stream-state.model';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { VolumeComponent } from './volume/volume.component';
import { BtnFullScreenComponent } from '../buttons/btn-full-screen/btn-full-screen.component';
import { LikeButtonComponent } from '../buttons/like-button/like-button.component';
import { DrawerService } from '../../services/drawer.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatSliderModule,
    FormsModule,
    VolumeComponent,
    BtnFullScreenComponent,
    LikeButtonComponent,
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('slider') slider!: ElementRef;
  @Input() files!: CloudFiles;
  @Input() playlistId!: string;
  @Input() drawerEndStatus!: boolean;
  public isShuffled: boolean = false;
  public state!: StreamState;
  private stateSubscription!: Subscription;
  public playingTrack!: TrackFile;
  private playingTrackSubscription!: Subscription;
  public elem: any;
  public isFullScreen: boolean = false;

  constructor(
    private layoutService: LayoutService,
    public audioService: AudioService,
    private elementRef: ElementRef,
    private drawerService: DrawerService
  ) {}

  ngOnInit(): void {
    this.layoutService.adjustElementHeights();
    this.subscribeTo();
    this.layoutService
      .observeFullscreenState()
      .subscribe((isFullScreen: boolean) => {
        this.isFullScreen = isFullScreen;
      });
    this.elem = this.elementRef.nativeElement;
  }

  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
    this.playingTrackSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.stateSubscription = this.audioService
      .observeStreamState()
      .subscribe((state: StreamState) => {
        this.state = state;
      });

    this.playingTrackSubscription = this.audioService
      .observePlayingTrack()
      .subscribe((track: TrackFile) => {
        if (track) {
          if (this.playingTrack?.id !== track.id) {
            this.playAudio(track, this.files);
          }
          this.playingTrack = track;
        }
      });
  }

  private async playAudio(track: TrackFile, files: CloudFiles): Promise<void> {
    this.audioService.stop();
    const url: string = this.getTrackUrl(files, track);
    this.audioService.playStream(url).subscribe((events) => {
      if (events.type === 'ended') {
        this.updatePlayingTrack();
      }
    });
  }

  private getTrackUrl(files: CloudFiles, track: TrackFile): string {
    if (track.playlistId) {
      return this.audioService.getFileUrl(files, track.index);
    }
    return track.previewUrl;
  }

  public get getLikedStatus(): boolean {
    if (this.playingTrack.playlistId) {
      const track = this.files.tracks[this.playingTrack.index];
      if(track) {
        return track.likedStatus;
      }
    }
    return this.playingTrack.likedStatus;
  }

  public get getImageUrl(): string {
    if (this.playingTrack.playlistId) {
      const track = this.files.tracks[this.playingTrack.index];
      if(track) {
        return track.img as string;
      }
    }
    return this.playingTrack.img;
  }

  public get getName(): string {
    if (this.playingTrack.playlistId) {
      const track = this.files.tracks[this.playingTrack.index];
      if(track) {
        return track.name as string;
      }
    }
    return this.playingTrack.name;
  }

  public get getArtists(): { name: string; id: string }[] {
    if (this.playingTrack.playlistId) {
      const track = this.files.tracks[this.playingTrack.index];
      if(track) {
        return track.artists;
      }
    }
    return this.playingTrack.artists;
  }

  public next(): void {
    this.changeTrackIndex('next');
  }

  public previous(): void {
    this.changeTrackIndex('previous');
  }

  private async changeTrackIndex(
    direction: 'next' | 'previous'
  ): Promise<void> {
    let trackIndex: number = this.playingTrack.index;
    trackIndex += direction === 'next' ? 1 : -1;
    const track: TrackFile = await this.audioService.getPlayingTrack(
      this.files,
      trackIndex
    );
    this.audioService.setPlayingTrack(track);
  }

  public togglePlayPause(event: Event): void {
    event.stopPropagation();
    this.audioService.togglePlayPause();
  }

  public get isFirstPlaying(): boolean {
    if (this.playingTrack.playlistId) {
      return this.playingTrack.index === 0;
    }
    return true;
  }

  public get isLastPlaying(): boolean {
    if (this.playingTrack.playlistId) {
      return this.playingTrack.index === this.files.tracks.length - 1;
    }
    return true;
  }

  public get isPlaylistEmpty(): boolean {
    return this.files.tracks.length === 0;
  }

  public onSliderChangeEnd(): void {
    const seconds: number = this.slider.nativeElement.value;
    this.audioService.seekTo(seconds);
  }

  public toggleShuffle(): void {
    this.isShuffled = !this.isShuffled;
  }

  private async updatePlayingTrack(): Promise<void> {
    if (this.isShuffled) {
      const trackIndex: number = this.getRandomTrackIndex();
      const track: TrackFile = await this.audioService.getPlayingTrack(
        this.files,
        trackIndex
      );
      this.audioService.setPlayingTrack(track);
    } else {
      this.next();
    }
  }

  private getRandomTrackIndex(): number {
    return Math.floor(Math.random() * this.files.tracks.length);
  }

  public toggleDrawerEnd(): void {
    this.drawerService.setdrawerEndStatus(!this.drawerEndStatus);
    this.drawerService.updateDrawerConfiguration(
      !this.drawerEndStatus,
      this.layoutService.isWindowWidthLessThan(1300),
      this.layoutService.isWindowWidthLessThan(1020)
    );
  }
}
