import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewHeaderComponent } from '../../components/view-header/view-header.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CommonModule } from '@angular/common';
import { CloudFiles, TrackFile } from '../../models/cloud.model';
import { CloudService } from '../../services/cloud.service';
import { Subscription } from 'rxjs';
import { CustomScrollbarDirective } from '../../directives/custom-scrollbar.directive';
import { StreamState } from '../../models/stream-state.model';
import { AudioService } from '../../services/audio.service';
import { PlatformDetectionService } from '../../services/platform-detection.service';
import { TrackListHeaderComponent } from '../../components/track-list-header/track-list-header.component';
import { BtnPlayComponent } from '../../components/buttons/btn-play/btn-play.component';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    ViewHeaderComponent,
    TrackListComponent,
    CommonModule,
    CustomScrollbarDirective,
    TrackListHeaderComponent,
    BtnPlayComponent,
  ],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit, OnDestroy {
  playlistFile!: CloudFiles;
  private cloudSubscription!: Subscription;
  public state!: StreamState;
  public playingTrack!: TrackFile;
  private stateSubscription!: Subscription;
  private playingTrackSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cloudService: CloudService,
    public audioService: AudioService,
    private platformDetectionService: PlatformDetectionService
  ) {
    this.subscribeTo();
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const playlistId = params['id'];
      if (this.platformDetectionService.isBrowser) {
        const files: CloudFiles = await this.cloudService.getFiles(playlistId);
        this.cloudService.setFiles(files);
      }
    });
  }

  ngOnDestroy(): void {
    this.cloudSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
    this.playingTrackSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.cloudSubscription = this.cloudService
      .observeFiles()
      .subscribe((files: CloudFiles) => {
        this.playlistFile = files;
      });
    this.stateSubscription = this.audioService
      .observeStreamState()
      .subscribe((state: StreamState) => {
        this.state = state;
      });
    this.playingTrackSubscription = this.audioService
      .observePlayingTrack()
      .subscribe((track: TrackFile) => {
        this.playingTrack = track;
      });
  }
}
