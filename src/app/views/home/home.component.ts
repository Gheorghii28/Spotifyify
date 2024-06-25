import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { ShelfComponent } from '../../components/shelf/shelf.component';
import { ShelfData, UserProfile } from '../../models/spotify.model';
import { HeaderComponent } from '../../layout/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, CommonModule, ShelfComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  shelvesData: ShelfData[] = [];
  userProfile!: UserProfile;

  constructor(
    private spotifyService: SpotifyService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private location: Location
  ) {}

  ngOnInit() {
    this.setUserProfileFromState();
    if (isPlatformBrowser(this.platformId)) {
      this.fetchAndStoreAllEndpointData();
    }
  }

  private setUserProfileFromState(): void {
    const state = this.location.getState() as any;
    this.userProfile = state?.user;
  }

  async fetchAndStoreAllEndpointData(): Promise<void> {
    try {
      const endpoints = await this.getEndpoints();
      const requests = endpoints.map((endpoint) =>
        this.spotifyService.getSpotifyData(endpoint)
      );
      this.shelvesData = await Promise.all(requests);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async getEndpoints(): Promise<string[]> {
    const data = await this.spotifyService.getSpotifyData('browse/categories');
    const endpoints: string[] = ['browse/featured-playlists'];
    const categoryEndpoints = data.categories.items.map(
      (item: { id: string }) => {
        return `browse/categories/${item.id}/playlists`;
      }
    );
    return [...endpoints, ...categoryEndpoints];
  }
}
