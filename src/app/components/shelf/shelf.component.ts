import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { Playlist, ShelfData } from '../../models/spotify.model';
import { SpotifyService } from '../../services/spotify.service';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-shelf',
  standalone: true,
  imports: [CardComponent, CommonModule, ResizeObserverDirective],
  templateUrl: './shelf.component.html',
  styleUrl: './shelf.component.scss',
})
export class ShelfComponent implements OnInit {
  @Input() endpoint!: string;
  data!: ShelfData;
  displayedItems: Playlist[] = [];
  private currentIndex: number = 0;
  private firstChildWidth!: number;
  private cardWidth: number = 200;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.fetchAndStoreEndpointData();
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
    const nativeElement = event.target as HTMLElement;
    if (this.isScrolledToRightEnd(nativeElement)) {
      this.loadMoreItems();
    }
  }

  public onResize(event: ResizeObserverEntry): void {
    const width = event.contentRect.width;
    this.firstChildWidth = width;
    this.loadMoreItems();
  }

  private async fetchAndStoreEndpointData(): Promise<void> {
    try {
      this.data = await lastValueFrom(
        this.spotifyService.getApiData(this.endpoint)
      );
      this.loadMoreItems();
    } catch (error) {
      console.error('Error fetching data:', error);
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
