import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Track,
  TracksObject,
  TracksObjectItem,
} from '../../models/spotify.model';
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
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-my-tracks',
  standalone: true,
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
    private audioService: AudioService,
    private spotifyService: SpotifyService
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
    return Promise.all(
      items.map(async (item, index) => {
        const myTrack = this.createTrackFile(item.track, index);
        myTrack.likedStatus = await this.fetchLikedStatus(myTrack.id);
        return myTrack;
      })
    );
  }

  private createTrackFile(track: Track, index: number): TrackFile {
    return new TrackFileClass(track, index, undefined, track.album.id);
  }

  private async fetchLikedStatus(trackId: string): Promise<boolean> {
    return this.spotifyService.fetchLikedStatusForTrack(trackId);
  }
}
