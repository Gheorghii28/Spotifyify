import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { Playlist, ShelfData } from '../../models/spotify.model';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-shelf',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './shelf.component.html',
  styleUrl: './shelf.component.scss',
})
export class ShelfComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() endpoint!: string;
  data!: ShelfData;
  displayedItems: Playlist[] = [];
  private observer!: ResizeObserver;
  private currentIndex: number = 0;
  private firstChildWidth!: number;
  private cardWidth: number = 200;

  constructor(
    private spotifyService: SpotifyService,
    private host: ElementRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.fetchAndStoreEndpointData();
  }

  ngAfterViewInit(): void {
    this.initializeResizeObserver();
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.host.nativeElement);
  }

  private initializeResizeObserver(): void {
    const firstChild = this.host.nativeElement.firstElementChild;
    if (firstChild) {
      this.observer = new ResizeObserver((entries) =>
        this.handleResize(entries)
      );
      this.observer.observe(firstChild);
    }
  }

  private handleResize(entries: ResizeObserverEntry[]): void {
    if (entries.length === 0) return;

    const entry = entries[0];
    const widthResizeEl = entry.contentRect.width;

    this.zone.run(() => {
      this.firstChildWidth = widthResizeEl;
      this.loadMoreItems();
    });
  }

  private async fetchAndStoreEndpointData(): Promise<void> {
    try {
      this.data = await this.spotifyService.getSpotifyData(this.endpoint);
      this.loadMoreItems();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
    const nativeElement = event.target as HTMLElement;
    if (this.isScrolledToRightEnd(nativeElement)) {
      this.loadMoreItems();
    }
  }

  private isScrolledToRightEnd(element: HTMLElement): boolean {
    const rightEnd =
      element.scrollWidth - (element.scrollLeft + element.clientWidth);
    return rightEnd < 100;
  }

  private loadMoreItems(): void {
    if (this.data) {
      const visibleCards = Math.ceil(this.firstChildWidth / this.cardWidth);
      const newItems = this.data.playlists.items.slice(
        this.currentIndex,
        this.currentIndex + visibleCards
      );
      this.displayedItems = [...this.displayedItems, ...newItems];
      this.currentIndex += visibleCards;
    }
  }
}
