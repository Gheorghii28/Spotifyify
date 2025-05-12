import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { lastValueFrom } from 'rxjs';
import { Playlist } from '../../models';
import { LayoutService, SpotifyService } from '../../services';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-shelf',
  imports: [
    CardComponent,
    SkeletonComponent,
    CommonModule,
    ResizeObserverDirective,
  ],
  templateUrl: './shelf.component.html',
  styleUrl: './shelf.component.scss',
})
export class ShelfComponent implements OnInit {
  private spotifyService = inject(SpotifyService);
  private layoutService = inject(LayoutService);

  @Input() query!: string;
  private playlists!: Playlist[];
  displayedPlaylists: Playlist[] = [];
  private currentIndex: number = 0;
  private shelfWidth!: number;
  isLoading: boolean = true;

  async ngOnInit(): Promise<void> {
    await this.getInitialPlaylists();
    this.isLoading = false;
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
    this.shelfWidth = width;
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
      const newItems = this.playlists.slice(
        this.currentIndex,
        this.currentIndex + this.getVisibleCards(Math.ceil)
      ).filter((playlist) => playlist !== null);
      this.displayedPlaylists = [...this.displayedPlaylists, ...newItems];
      this.currentIndex += this.getVisibleCards();
    }
  }

  public get cardHeight(): number {
    return this.layoutService.cardHeight;
  }

  public get cardWidth(): number {
    return this.layoutService.cardWidth;
  }

  public getVisibleCards(roundFn: (value: number) => number = Math.floor): number {
    return roundFn(this.shelfWidth / this.cardWidth);
  }  
}
