import { Component, inject } from '@angular/core';
import { SearchService } from '../../services';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  private searchService = inject(SearchService);

  public onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.trim();
    this.searchService.search(query);
  }
}
