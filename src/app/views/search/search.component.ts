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
import { SpotifyService } from '../../services/spotify.service';

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
    public audioService: AudioService,
    private spotifyService: SpotifyService
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

  public async onSearchResultsChange(
    results: SpotifySearchResults | null
  ): Promise<void> {
    this.tracks = [];
    this.playlists = [];
    if (results) {
      this.tracks = await this.getFilteredTracks(results);
      this.playlists = results.playlists?.items || [];
    }
  }

  private async getFilteredTracks(
    results: SpotifySearchResults | null
  ): Promise<TrackFile[]> {
    if (!results || !results.tracks || !results.tracks.items) {
      return [];
    }
    const filteredTracks = this.filterTracksWithPreviewUrl(
      results.tracks.items
    );
    const trackFiles = await this.createTrackFilesWithLikedStatus(
      filteredTracks
    );
    return trackFiles;
  }

  private filterTracksWithPreviewUrl(
    tracks: SpotifySearchTrack[]
  ): SpotifySearchTrack[] {
    return tracks.filter((track) => track.preview_url !== null);
  }

  private async createTrackFilesWithLikedStatus(
    tracks: SpotifySearchTrack[]
  ): Promise<TrackFile[]> {
    return Promise.all(
      tracks.map(async (track, index) => {
        const searchedTrack = this.createTrackFile(track, index);
        searchedTrack.likedStatus = await this.fetchLikedStatus(
          searchedTrack.id
        );
        return searchedTrack;
      })
    );
  }

  private createTrackFile(track: SpotifySearchTrack, index: number): TrackFile {
    return new TrackFileClass(track, index, undefined, track.album.id);
  }

  private async fetchLikedStatus(trackId: string): Promise<boolean> {
    return this.spotifyService.fetchLikedStatusForTrack(trackId);
  }
}
