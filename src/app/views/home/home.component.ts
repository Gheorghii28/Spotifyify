import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { ShelfComponent } from '../../components/shelf/shelf.component';
import { UserProfile } from '../../models/spotify.model';
import { HeaderComponent } from '../../layout/header/header.component';
import { Subscription } from 'rxjs';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, CommonModule, ShelfComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  userProfile!: UserProfile;
  displayedEndpoints: string[] = [];
  private endpoints: string[] = [];
  private currentIndex: number = 0;
  private windowHeight!: number;
  private shelfHeight = 379;
  private scrollSubscription!: Subscription;

  constructor(
    private spotifyService: SpotifyService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private location: Location,
    private scrollService: ScrollService
  ) {}

  ngOnInit() {
    this.setUserProfileFromState();
    this.setScrollSubscription();
    if (isPlatformBrowser(this.platformId)) {
      this.windowHeight = window.innerHeight;
      this.getEndpoints();
    }
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.windowHeight = window.innerHeight;
    this.loadMoreEndpoints();
  }

  private setScrollSubscription(): void {
    this.scrollSubscription = this.scrollService.scroll$.subscribe(
      (event: Event) => {
        this.handleScroll(event);
      }
    );
  }

  private setUserProfileFromState(): void {
    const state = this.location.getState() as any;
    this.userProfile = state?.user;
  }

  private async getEndpoints(): Promise<void> {
    const data = await this.spotifyService.getSpotifyData('browse/categories');
    const featuredEndpoint: string[] = ['browse/featured-playlists'];
    const categoryEndpoints = data.categories.items.map(
      (item: { id: string }) => {
        return `browse/categories/${item.id}/playlists`;
      }
    );
    this.endpoints = [...featuredEndpoint, ...categoryEndpoints];
    this.loadMoreEndpoints();
  }

  private loadMoreEndpoints(): void {
    const visibleShelves = Math.ceil(this.windowHeight / this.shelfHeight);
    const newEndpoints = this.endpoints.slice(
      this.currentIndex,
      this.currentIndex + visibleShelves
    );
    this.displayedEndpoints = [...this.displayedEndpoints, ...newEndpoints];
    this.currentIndex += visibleShelves;
  }

  private handleScroll(event: Event): void {
    const target = event.target as HTMLElement;

    if (this.isRouterOutletArea(target) && this.isScrollAtBottom(target)) {
      this.loadMoreEndpoints();
    }
  }

  private isRouterOutletArea(target: HTMLElement): boolean {
    return target?.classList.contains('router-outlet-area') || false;
  }

  private isScrollAtBottom(target: HTMLElement): boolean {
    return this.calculateScrollRemaining(target) < 1;
  }

  private calculateScrollRemaining(target: HTMLElement): number {
    const scrollPosition = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    return scrollHeight - clientHeight - scrollPosition;
  }
}
