import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
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
import { TrackListHeaderComponent } from '../../components/track-list-header/track-list-header.component';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';

interface ElementConfig {
  nativeElement: HTMLElement | undefined;
  threshold: number;
}
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    HeaderComponent,
    SearchBarComponent,
    CommonModule,
    TrackListComponent,
    CardComponent,
    TrackListHeaderComponent,
    ResizeObserverDirective,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  public userProfile!: UserProfile;
  tracks: TrackFile[] = [];
  playlists: Playlist[] = [];
  state!: StreamState;
  playingTrack!: TrackFile;
  playlistFile!: CloudFiles;
  private cloudSubscription!: Subscription;
  private stateSubscription!: Subscription;
  private playingTrackSubscription!: Subscription;
  private elements: { [key in keyof HeaderComponent]?: ElementConfig } = {
    userNotifications: { nativeElement: undefined, threshold: 630 },
    userInbox: { nativeElement: undefined, threshold: 520 },
    userName: { nativeElement: undefined, threshold: 470 },
    userInfo: { nativeElement: undefined, threshold: 420 },
  };

  constructor(
    private location: Location,
    private cloudService: CloudService,
    public audioService: AudioService
  ) {}

  ngOnInit() {
    this.setUserProfileFromState();
    this.subscribeTo();
  }

  ngAfterViewInit(): void {
    this.initializeElements();
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
      this.playlists = results.playlists?.items.filter((item) => item !== null) || [];
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
    return tracks.filter((track) => track.preview_url === null); //spotify wep api endpoint 30-second preview_url is nullable/deprecated
  }

  private async createTrackFilesWithLikedStatus(
    tracks: SpotifySearchTrack[]
  ): Promise<TrackFile[]> {
    const searchedTracks = this.createTrackFile(tracks).slice(0, 50);
    const updatedTracks: TrackFile[] =
      await this.cloudService.updateTrackLikedStatus(searchedTracks);
    return updatedTracks;
  }

  private createTrackFile(tracks: SpotifySearchTrack[]): TrackFile[] {
    return tracks.map(
      (track, index) =>
        new TrackFileClass(track, index, undefined, track.album.id)
    );
  }

  private initializeElements(): void {
    for (const key in this.elements) {
      if (this.elements.hasOwnProperty(key)) {
        const elementRef = this.headerComponent[
          key as keyof HeaderComponent
        ] as ElementRef | undefined;
        if (elementRef) {
          this.elements[key as keyof HeaderComponent]!.nativeElement =
            elementRef.nativeElement;
        }
      }
    }
  }

  public onResize(event: ResizeObserverEntry): void {
    const width = event.contentRect.width;

    for (const key in this.elements) {
      if (this.elements.hasOwnProperty(key)) {
        const element = this.elements[key as keyof HeaderComponent];
        if (element?.nativeElement) {
          element.nativeElement.style.display =
            width < element.threshold ? 'none' : '';
        }
      }
    }
  }
}
