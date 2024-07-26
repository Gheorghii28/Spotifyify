import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import {
  Playlist,
  SpotifySearchResults,
  SpotifySearchTrack,
  UserProfile,
} from '../../models/spotify.model';
import { CommonModule, Location } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import {
  CloudFiles,
  TrackFile,
  TrackFileClass,
} from '../../models/cloud.model';
import { CardComponent } from '../../components/card/card.component';
import { CloudService } from '../../services/cloud.service';
import { StreamState } from '../../models/stream-state.model';
import { Subscription } from 'rxjs';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    HeaderComponent,
    SearchBarComponent,
    CommonModule,
    TrackListComponent,
    CardComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  public userProfile!: UserProfile;
  tracks: TrackFile[] = [];
  playlists: Playlist[] = [];
  state!: StreamState;
  playingTrack!: TrackFile;
  playlistFile!: CloudFiles;
  private cloudSubscription!: Subscription;
  private stateSubscription!: Subscription;
  private playingTrackSubscription!: Subscription;

  constructor(
    private location: Location,
    private cloudService: CloudService,
    public audioService: AudioService
  ) {}

  ngOnInit() {
    this.setUserProfileFromState();
    this.subscribeTo();
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

  private setUserProfileFromState(): void {
    const state = this.location.getState() as any;
    this.userProfile = state?.user;
  }

  public onSearchResultsChange(results: SpotifySearchResults | null): void {
    this.tracks = [];
    this.playlists = [];
    if (results) {
      this.tracks = this.getFilteredTracks(results);
      this.playlists = results.playlists?.items || [];
    }
  }

  private getFilteredTracks(results: SpotifySearchResults | null): TrackFile[] {
    return (
      results?.tracks?.items.filter(
        (track: SpotifySearchTrack) => track.preview_url !== null
      ) || []
    ).map((track: any, index: number) => {
      return new TrackFileClass(track, index, undefined, track.album.id);
    });
  }
}
