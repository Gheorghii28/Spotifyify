import { Component, inject } from '@angular/core';
import { MatListItemIcon, MatListModule } from '@angular/material/list';
import { SearchService } from '../../services';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-search-overlay',
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatListItemIcon,
    MatIconButton
  ],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss'
})
export class SearchOverlayComponent {

  private searchService = inject(SearchService);

  public get recentSearches(): string[] {
    return this.searchService.recentSearches().slice(0, 5);
  }

  public deleteRecentSearch(searchTerm: string): void {
    this.searchService.deleteRecentSearch(searchTerm);
  }

  public performSearch(searchTerm: string): void {
    this.searchService.search(searchTerm);
  }
}
