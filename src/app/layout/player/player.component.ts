import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutService } from '../../services/layout.service';
import { CloudFiles, TrackFile } from '../../models/cloud.model';
import { AudioService } from '../../services/audio.service';
import { CommonModule } from '@angular/common';
import { StreamState } from '../../models/stream-state.model';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { VolumeComponent } from './volume/volume.component';
import { BtnFullScreenComponent } from '../../components/buttons/btn-full-screen/btn-full-screen.component';
import { LikeButtonComponent } from '../../components/buttons/like-button/like-button.component';
import { DrawerService } from '../../services/drawer.service';

@Component({
  selector: 'app-player',
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
export class PlayerComponent implements OnInit {
  @ViewChild('slider') slider!: ElementRef;
  @Input() files!: CloudFiles;
  @Input() playlistId!: string;
  @Input() drawerEndStatus!: boolean;
  @Input() isShuffled!: boolean;
  @Input() repeatMode!: number;
  @Input() playingTrack!: TrackFile;
  @Input() state!: StreamState;
  @Input() isFullScreen!: boolean;
  public elem: any;

  constructor(
    private layoutService: LayoutService,
    public audioService: AudioService,
    private elementRef: ElementRef,
    private drawerService: DrawerService,
  ) {}

  ngOnInit(): void {
    this.layoutService.adjustElementHeights();
    this.elem = this.elementRef.nativeElement;
  }

  private get currentTrack(): TrackFile {
    if (this.playingTrack.playlistId) {
      return this.files.tracks[this.playingTrack.index] ?? this.playingTrack;
    }
    return this.playingTrack;
  }

  public get getLikedStatus(): boolean {
    return this.currentTrack.likedStatus;
  }
  
  public get getImageUrl(): string {
    return this.currentTrack.img;
  }
  
  public get getName(): string {
    return this.currentTrack.name;
  }
  
  public get getArtists(): { name: string; id: string }[] {
    return this.currentTrack.artists;
  }

  public get isFirstPlaying(): boolean {
    return this.currentTrack.index === 0;
  }

  public get isLastPlaying(): boolean {
    return this.currentTrack.index === this.files.tracks.length - 1;
  }

  public get isPlaylistEmpty(): boolean {
    return this.files.tracks.length === 0;
  }
  
  public toggleRepeat(): void {
    const newRepeatMode = (this.repeatMode + 1) % 3;
    this.audioService.setRepeatMode(newRepeatMode);
  }

  public next(): void {
    this.audioService.changeTrackIndex('next', this.playingTrack.index, this.files);
  }

  public previous(): void {
    this.audioService.changeTrackIndex('previous', this.playingTrack.index, this.files);
  }

  public togglePlayPause(event: Event): void {
    event.stopPropagation();
    this.audioService.togglePlayPause();
  }

  public onSliderChangeEnd(): void {
    const seconds: number = this.slider.nativeElement.value;
    this.audioService.seekTo(seconds);
  }

  public toggleShuffle(): void {
    const isShuffled = !this.isShuffled;
    this.audioService.setIsShuffled(isShuffled);
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
