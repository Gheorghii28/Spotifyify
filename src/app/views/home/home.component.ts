import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShelfComponent } from '../../components/shelf/shelf.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Subscription } from 'rxjs';
import { User } from '../../models';
import { PlaylistQueryService, ScrollService, UserService } from '../../services';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ShelfComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {

  private scrollService = inject(ScrollService);
  private playlistQueryService = inject(PlaylistQueryService);
  private userService = inject(UserService);  

  displayedQueries: string[] = [];
  private queries: string[] = [];
  private currentIndex: number = 0;
  private windowHeight!: number;
  private shelfHeight = 379;
  private scrollSubscription!: Subscription;

  ngOnInit() {
    this.setScrollSubscription();
    this.windowHeight = window.innerHeight;
    this.getQueries();
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.windowHeight = window.innerHeight;
    this.loadMoreQueries();
  }

  private setScrollSubscription(): void {
    this.scrollSubscription = this.scrollService.scroll$.subscribe(
      (event: Event) => {
        this.handleScroll(event);
      }
    );
  }

  private async getQueries(): Promise<void> {
    const playlistSearchQueries = this.playlistQueryService.getQueries();
    this.queries = [...playlistSearchQueries];
    this.loadMoreQueries();
  }

  private loadMoreQueries(): void {
    const visibleShelves = Math.ceil(this.windowHeight / this.shelfHeight);
    const newQueries = this.queries.slice(
      this.currentIndex,
      this.currentIndex + visibleShelves
    );
    this.displayedQueries = [...this.displayedQueries, ...newQueries];
    this.currentIndex += visibleShelves;
  }

  private handleScroll(event: Event): void {
    const target = event.target as HTMLElement;

    if (this.isRouterOutletArea(target) && this.isScrollAtBottom(target)) {
      this.loadMoreQueries();
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

  public get user(): User {
    return this.userService.user()!;
  }
}
