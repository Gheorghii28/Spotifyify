import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { lastValueFrom } from 'rxjs';
import { Playlist } from '../../models';
import { SpotifyService } from '../../services';

@Component({
  selector: 'app-shelf',
  imports: [CardComponent, CommonModule, ResizeObserverDirective],
  templateUrl: './shelf.component.html',
  styleUrl: './shelf.component.scss',
})
export class ShelfComponent implements OnInit {
  private spotifyService = inject(SpotifyService);

  @Input() query!: string;
  private playlists!: Playlist[];
  displayedPlaylists: Playlist[] = [];
  private currentIndex: number = 0;
  private firstChildWidth!: number;
  private cardWidth: number = 200;

  ngOnInit(): void {
    this.getInitialPlaylists();
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

  private async getInitialPlaylists(): Promise<void> {
    try {
      this.playlists = await lastValueFrom(
        this.spotifyService.searchByType<Playlist>(this.query, 'playlist')
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
    if (this.playlists) {
      const visibleCards = Math.ceil(this.firstChildWidth / this.cardWidth);
      const newItems = this.playlists.slice(
        this.currentIndex,
        this.currentIndex + visibleCards
      ).filter((playlist) => playlist !== null);
      this.displayedPlaylists = [...this.displayedPlaylists, ...newItems];
      this.currentIndex += visibleCards;
    }
  }
}
