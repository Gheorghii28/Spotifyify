import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { PlayingInfoComponent } from './playing-info/playing-info.component';
import { CustomScrollbarDirective } from '../directives/custom-scrollbar.directive';
import { firstValueFrom } from 'rxjs';
import { AudioService, DrawerService, LayoutService, LikedTracksService, SpotifyService, UtilsService } from '../services';
import { ScrollManagerService } from './services/scroll-manager.service';
import { Track } from '../models';
import { StreamState } from '../models/stream-state.model';

@Component({
  selector: 'app-layout',
  imports: [
    SidenavComponent,
    RouterOutlet,
    PlayerComponent,
    PlayingInfoComponent,
    CommonModule,
    MatDrawer,
    MatSidenavModule,
    CustomScrollbarDirective,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  private scrollManager = inject(ScrollManagerService);
  private spotifyService = inject(SpotifyService);
  private likedTracksService = inject(LikedTracksService);
  private layoutService = inject(LayoutService);
  private drawerService = inject(DrawerService);
  private utilsService = inject(UtilsService);
  private audioService = inject(AudioService);

  constructor() {
    effect(async () => {
      const playingTrack = this.audioService.playingTrack();
      if (playingTrack && playingTrack.previewUrl) {
        this.audioService.playStream(playingTrack.previewUrl).subscribe((event) => {
          if (event.type === 'ended') {
            this.audioService.onTrackEnded();
          }
        });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.layoutService.adjustHeightOnWindowResize();
    this.layoutService.handleDrawerOnResize();
    const tracks = await firstValueFrom(this.spotifyService.getUsersSavedTracks());
    const trackIds = tracks.map(track => track.id);
    this.likedTracksService.setLikedTracks(trackIds);
  }

  ngAfterViewInit(): void {
    this.scrollManager.registerScrollContainer(this.scrollContainer);
  }

  ngOnDestroy(): void {
    this.scrollManager.unregister();
  }

  public get sidenavExpanded(): boolean {
    return this.drawerService.sidenavExpanded()!;
  }

  public get sidenavWidth(): number {
    return this.drawerService.sidenavWidth()!;
  }

  public get movedToFolder(): boolean {
    return this.utilsService.movedToFolder()!;
  }

  public get isDrawerInfoOpened(): boolean {
    return this.drawerService.isDrawerInfoOpened()!;
  }

  public get isFullScreen(): boolean {
    return this.layoutService.isFullScreen()!;
  }

  public get playingTrack(): Track {
    return this.audioService.playingTrack()!;
  }

  public get state(): StreamState {
    return this.audioService.state()!;
  }
}
