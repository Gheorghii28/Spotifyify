import { Component, effect, EffectRef, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShelfComponent } from '../../components/shelf/shelf.component';
import { HeaderComponent } from '../../components/header/header.component';
import { User } from '../../models';
import { PlaylistQueryService, ScrollService, UserService, UtilsService } from '../../services';

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
  private utilsService = inject(UtilsService);

  displayedQueries: string[] = [];
  private queries: string[] = [];
  private currentIndex: number = 0;
  private windowHeight!: number;
  private shelfHeight = 379;
  private destroyEffect!: EffectRef;

  constructor() {
    this.destroyEffect = effect(() => {
      const scrollEvent = this.scrollService.scroll();
      if (scrollEvent) {
        this.utilsService.handleScroll(
          scrollEvent,
          () => this.loadMoreQueries()
        );
      }
    });
  }

  ngOnInit() {
    this.windowHeight = window.innerHeight;
    this.getQueries();
  }

  ngOnDestroy(): void {
    this.destroyEffect.destroy();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.windowHeight = window.innerHeight;
    this.loadMoreQueries();
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

  public get user(): User {
    return this.userService.user()!;
  }
}
