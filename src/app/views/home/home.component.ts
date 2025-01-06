import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule, Location } from '@angular/common';
import { ShelfComponent } from '../../components/shelf/shelf.component';
import { UserProfile } from '../../models/spotify.model';
import { HeaderComponent } from '../../layout/header/header.component';
import { Subscription } from 'rxjs';
import { ScrollService } from '../../services/scroll.service';
import { PlatformDetectionService } from '../../services/platform-detection.service';
import { PlaylistQueryService } from '../../services/playlist-query.service';

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
    private location: Location,
    private scrollService: ScrollService,
    private platformDetectionService: PlatformDetectionService,
    private playlistQueryService: PlaylistQueryService,
  ) {}

  ngOnInit() {
    this.setUserProfileFromState();
    this.setScrollSubscription();
    if (this.platformDetectionService.isBrowser) {
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
    const playlistSearchQueries = this.playlistQueryService.getQueries();
    const playlistSearchEndpoints: string[] = playlistSearchQueries.map((query) => {
      return `search?q=${query}&type=playlist`;
    });
    this.endpoints = [...playlistSearchEndpoints];
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
