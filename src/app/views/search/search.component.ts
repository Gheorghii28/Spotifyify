import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule, Location } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CardComponent } from '../../components/card/card.component';
import { TrackListHeaderComponent } from '../../components/track-list-header/track-list-header.component';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { Playlist, SearchResults, Track, User } from '../../models';
import { AudioService, LayoutService, SearchService } from '../../services';
import { StreamState } from '../../models/stream-state.model';
import { MatToolbar } from '@angular/material/toolbar';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';
import { MatIconModule } from '@angular/material/icon';

interface ElementConfig {
  nativeElement: HTMLElement | undefined;
  threshold: number;
}
@Component({
  standalone: true,
  selector: 'app-search',
  imports: [
    HeaderComponent,
    SearchBarComponent,
    CommonModule,
    MatIconModule,
    TrackListComponent,
    CardComponent,
    TrackListHeaderComponent,
    ResizeObserverDirective,
    MatToolbar,
    SkeletonComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, AfterViewInit {
  private location = inject(Location);
  private searchService = inject(SearchService);
  private audioService = inject(AudioService);
  private layoutService = inject(LayoutService);

  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  public user!: User;

  private elements: { [key in keyof HeaderComponent]?: ElementConfig } = {
    userNotifications: { nativeElement: undefined, threshold: 630 },
    userInbox: { nativeElement: undefined, threshold: 520 },
    userName: { nativeElement: undefined, threshold: 470 },
    userInfo: { nativeElement: undefined, threshold: 420 },
  };

  ngOnInit() {
    this.setUserProfileFromState();
  }

  ngAfterViewInit(): void {
    this.initializeElements();
  }

  private setUserProfileFromState(): void {
    const state = this.location.getState() as any;
    this.user = state?.user;
  }

  public trackByPlaylistId(index: number, playlist: Playlist): string {
    return playlist?.id;
  }

  public trackByTrackId(index: number, track: Track): string {
    return track.id;
  }

  public get searchResultPlaylist(): Playlist {
    return this.searchService.searchResultPlaylist() as Playlist;
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

  public get playingTrack(): Track {
    return this.audioService.playingTrack()!;
  }

  public get state(): StreamState {
    return this.audioService.state()!;
  }

  public get isLoading(): boolean {
    return this.searchService.isLoading();
  }

  public get searchResults(): SearchResults {
    return this.searchService.searchResults();
  }

  public get cardHeight(): number {
    return this.layoutService.cardHeight;
  }

  public get cardWidth(): number {
    return this.layoutService.cardWidth;
  }

  public get trackListHeight(): number {
    return this.layoutService.trackListHeight;
  }
}
