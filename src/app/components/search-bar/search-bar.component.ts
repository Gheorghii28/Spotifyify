import { Component, inject } from '@angular/core';
import { SearchService } from '../../services';
import { AutofocusDirective } from '../../directives/autofocus.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-search-bar',
  imports: [
    AutofocusDirective,
    OverlayModule,
    SearchOverlayComponent,
    NgClass,
    MatIconModule,
    MatButtonModule,
    MatIconButton
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  private searchService = inject(SearchService);

  public onInputClick(): void {
    if (this.recentSearches.length === 0) return;
    this.toggleSearchOverlay(true);
  }

  public toggleSearchOverlay(open: boolean) {
    this.searchService.overlayOpen.set(open);
  }

  public search(searchTerm: string): void {
    this.searchService.search(searchTerm);
  }

  public clearSearch(): void {
    this.searchService.clearSearch();
  }

  public get overlayOpen(): boolean {
    return this.searchService.overlayOpen();
  }

  public get searchTerm(): string {
    return this.searchService.searchTerm();
  }

  public get recentSearches(): string[] {
    return this.searchService.recentSearches();
  }
}
