import {
  Component,
  computed,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { StreamState } from '../../models/stream-state.model';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { VolumeComponent } from './volume/volume.component';
import { BtnFullScreenComponent } from '../../components/buttons/btn-full-screen/btn-full-screen.component';
import { LikeButtonComponent } from '../../components/buttons/like-button/like-button.component';
import { Track } from '../../models';
import { AudioService, DrawerService, LayoutService, LikedTracksService, NavigationService } from '../../services';

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
  private likedTracksService = inject(LikedTracksService);
  private audioService = inject(AudioService);
  private layoutService = inject(LayoutService);
  private drawerService = inject(DrawerService);
  private navigationService = inject(NavigationService);
  private elementRef = inject(ElementRef);

  @ViewChild('slider') slider!: ElementRef;
  @Input() playlistId!: string;
  @Input() drawerEndStatus!: boolean;
  @Input() state!: StreamState;
  @Input() isFullScreen!: boolean;
  elem: any;
  trackIsLiked = computed(() => {
    const id = this.audioService.playingTrack()?.id;
    if (!id) return false;
    return this.likedTracksService.isLiked(id)();
  });


  ngOnInit(): void {
    this.layoutService.adjustElementHeights();
    this.elem = this.elementRef.nativeElement;
  }

  public get playingTrack(): Track | null {
    return this.audioService.playingTrack();
  }

  public get isShuffle(): boolean {
    return this.audioService.isShuffle();
  }

  public get repeatMode(): 'off' | 'track' | 'playlist' {
    return this.audioService.repeatMode();
  }

  public get isFirstPlaying(): boolean {
    return this.audioService.currentIndex() === 0;
  }

  public get isLastPlaying(): boolean {
    return this.audioService.currentIndex() === this.audioService.playingPlaylist().length - 1;
  }

  public get isPlaylistEmpty(): boolean {
    return this.audioService.playingPlaylist().length === 0;
  }

  public onRepeatClicked(): void {
    this.audioService.toggleRepeatMode();
  }

  public onNextClicked(): void {
    this.audioService.nextTrack();
  }

  public onPreviousClicked(): void {
    this.audioService.previousTrack();
  }

  public onPlayPauseClicked(): void {
    this.audioService.togglePlayPause();
  }

  public onSliderChangeEnd(): void {
    const seconds: number = this.slider.nativeElement.value;
    this.audioService.seekTo(seconds);
  }

  public onShuffleClicked(): void {
    this.audioService.toggleShuffle();
  }

  public toggleDrawerEnd(): void {
    this.drawerService.isDrawerInfoOpened.set(!this.drawerEndStatus);
    this.drawerService.updateDrawerConfiguration(
      !this.drawerEndStatus,
      this.layoutService.isWindowWidthLessThan(1300),
      this.layoutService.isWindowWidthLessThan(1020)
    );
  }

  public navigateToArtist(id: string): void {
    this.navigationService.artist(id);
  }
}
