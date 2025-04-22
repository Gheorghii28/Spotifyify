import { Component, OnDestroy, OnInit } from '@angular/core';
import { TracksObject, TracksObjectItem } from '../../models/spotify.model';
import { Subscription } from 'rxjs';
import { CloudService } from '../../services/cloud.service';
import { ViewHeaderComponent } from '../../components/view-header/view-header.component';
import {
  CloudFiles,
  MyTracks,
  MyTracksClass,
  TrackFile,
  TrackFileClass,
} from '../../models/cloud.model';
import { AudioService } from '../../services/audio.service';
import { StreamState } from '../../models/stream-state.model';
import { TrackListHeaderComponent } from '../../components/track-list-header/track-list-header.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-tracks',
  imports: [
    ViewHeaderComponent,
    TrackListHeaderComponent,
    TrackListComponent,
    CommonModule,
  ],
  templateUrl: './my-tracks.component.html',
  styleUrl: './my-tracks.component.scss',
})
export class MyTracksComponent implements OnInit, OnDestroy {
  myTracks!: MyTracks;
  playlistFile!: CloudFiles;
  playingTrack!: TrackFile;
  state!: StreamState;
  private myTracksSubscription!: Subscription;
  private cloudSubscription!: Subscription;
  private playingTrackSubscription!: Subscription;
  private stateSubscription!: Subscription;

  constructor(
    private cloudService: CloudService,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {
    this.myTracks = new MyTracksClass();
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.myTracksSubscription.unsubscribe();
    this.cloudSubscription.unsubscribe();
    this.playingTrackSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.cloudSubscription = this.cloudService
      .observeFiles()
      .subscribe((files: CloudFiles) => {
        this.playlistFile = files;
      });
    this.playingTrackSubscription = this.audioService
      .observePlayingTrack()
      .subscribe((track: TrackFile) => {
        this.playingTrack = track;
      });
    this.stateSubscription = this.audioService
      .observeStreamState()
      .subscribe((state: StreamState) => {
        this.state = state;
      });
    this.myTracksSubscription = this.cloudService
      .observeMyTracks()
      .subscribe(async (tracks: TracksObject) => {
        const items: TracksObjectItem[] = tracks.items;
        if (items) {
          const myTracks = await this.createTrackFiles(items);
          if (myTracks.length > 0) {
            this.myTracks.tracks = myTracks;
          }
        }
      });
  }

  private async createTrackFiles(
    items: TracksObjectItem[]
  ): Promise<TrackFile[]> {
    const myTracks = this.createTrackFile(items).slice(0, 50);
    const updatedTracks: TrackFile[] =
      await this.cloudService.updateTrackLikedStatus(myTracks);
    return updatedTracks;
  }

  private createTrackFile(items: TracksObjectItem[]): TrackFile[] {
    return items.map(
      (item, index) =>
        new TrackFileClass(item.track, index, undefined, item.track.album.id)
    );
  }
}
