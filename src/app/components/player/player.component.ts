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
import { HeightService } from '../../services/height.service';
import { CloudFiles } from '../../models/cloud.model';
import { Subscription } from 'rxjs';
import { AudioService } from '../../services/audio.service';
import { CommonModule } from '@angular/common';
import { PlayingTrack, StreamState } from '../../models/stream-state.model';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { VolumeComponent } from './volume/volume.component';
import { BtnFullScreenComponent } from '../btn-full-screen/btn-full-screen.component';

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
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('slider') slider!: ElementRef;
  @Input() files!: CloudFiles;
  @Input() playListId!: string;
  public isShuffled: boolean = false;
  public state!: StreamState;
  private stateSubscription!: Subscription;
  public playingTrack!: PlayingTrack;
  private playingTrackSubscription!: Subscription;
  public elem: any;
  public isFullScreen: boolean = false;

  constructor(
    private heightService: HeightService,
    public audioService: AudioService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.heightService.adjustElementHeights();
    this.subscribeTo();
    this.heightService.isFullscreen$().subscribe((isFullScreen: boolean) => {
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
      .subscribe((track: PlayingTrack) => {
        this.playingTrack = track;
        this.playAudio(track.index, this.files);
      });
  }

  private async playAudio(
    trackIndex: number,
    files: CloudFiles
  ): Promise<void> {
    this.audioService.stop();
    const url: string = this.audioService.getFileUrl(files, trackIndex);
    this.audioService.playStream(url).subscribe((events) => {
      if (events.type === 'ended') {
        this.updatePlayingTrack();
      }
    });
  }

  public next(): void {
    this.changeTrackIndex('next');
  }

  public previous(): void {
    this.changeTrackIndex('previous');
  }

  private changeTrackIndex(direction: 'next' | 'previous'): void {
    const playingTrack: PlayingTrack = { ...this.playingTrack };
    playingTrack.index += direction === 'next' ? 1 : -1;
    this.audioService.setPlayingTrack(playingTrack);
  }
  
  public togglePlayPause(event: Event): void {
    event.stopPropagation();
    this.audioService.togglePlayPause();
  }

  public isFirstPlaying(): boolean {
    return this.playingTrack.index === 0;
  }

  public isLastPlaying(): boolean {
    return this.playingTrack.index === this.files.tracks.length - 1;
  }

  public onSliderChangeEnd(): void {
    const seconds: number = this.slider.nativeElement.value;
    this.audioService.seekTo(seconds);
  }

  public toggleShuffle(): void {
    this.isShuffled = !this.isShuffled;
  }

  private updatePlayingTrack(): void {
    if (this.isShuffled) {
      const playingTrack: PlayingTrack = { ...this.playingTrack };
      const trackIndex: number = this.getRandomTrackIndex();
      playingTrack.index = trackIndex;
      this.audioService.setPlayingTrack(playingTrack);
    } else {
      this.next();
    }
  }

  private getRandomTrackIndex(): number {
    return Math.floor(Math.random() * this.files.tracks.length);
  }
}
