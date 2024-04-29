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
import { StreamState } from '../../models/stream-state.model';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { VolumeComponent } from './volume/volume.component';

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
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('slider') slider!: ElementRef;
  @Input() files!: CloudFiles;
  @Input() playListId!: string;
  public trackIndex: number = 0;
  public isShuffled: boolean = false;
  public state!: StreamState;
  private trackIndexSubscription!: Subscription;
  private stateSubscription!: Subscription;

  constructor(
    private heightService: HeightService,
    public audioService: AudioService
  ) {}

  ngOnInit(): void {
    this.heightService.adjustElementHeights();
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.trackIndexSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.stateSubscription = this.audioService.getState().subscribe((state) => {
      this.state = state;
    });
    this.trackIndexSubscription = this.audioService
      .getTrackIndex()
      .subscribe((trackIndex) => {
        if (trackIndex === undefined || !this.files.tracks[trackIndex]) {
          trackIndex = 0;
        }
        this.playAudio(trackIndex, this.files);
        this.trackIndex = trackIndex;
      });
  }

  private async playAudio(
    trackIndex: number,
    files: CloudFiles
  ): Promise<void> {
    this.audioService.stop();
    const url = this.audioService.getFileUrl(files, trackIndex);
    this.audioService.playStream(url, this.playListId).subscribe((events) => {
      if (events.type === 'ended') {
        this.updateTrackIndex();
      }
    });
  }

  public next(): void {
    this.audioService.setTrackIndex(this.trackIndex + 1);
  }

  public previous(): void {
    this.audioService.setTrackIndex(this.trackIndex - 1);
  }

  public togglePlayPause(event: Event): void {
    event.stopPropagation();
    this.audioService.togglePlayPause();
  }

  public isFirstPlaying(): boolean {
    return this.trackIndex === 0;
  }

  public isLastPlaying(): boolean {
    return this.trackIndex === this.files.tracks.length - 1;
  }

  public onSliderChangeEnd(): void {
    const seconds: number = this.slider.nativeElement.value;
    this.audioService.seekTo(seconds);
  }

  public toggleShuffle(): void {
    this.isShuffled = !this.isShuffled;
  }

  private updateTrackIndex(): void {
    if (this.isShuffled) {
      const trackIndex = this.getRandomTrackIndex();
      this.audioService.setTrackIndex(trackIndex);
    } else {
      this.audioService.setTrackIndex(this.trackIndex + 1);
    }
  }

  private getRandomTrackIndex(): number {
    return Math.floor(Math.random() * this.files.tracks.length);
  }
}
