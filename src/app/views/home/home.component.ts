import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { ShelfComponent } from '../../components/shelf/shelf.component';
import { ShelfData } from '../../models/spotify.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, CommonModule, ShelfComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  shelvesData: ShelfData[] = [];
  endpoints: string[] = ['browse/featured-playlists'];

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.fetchAndStoreAllEndpointData();
  }

  async fetchAndStoreAllEndpointData() {
    try {
      const requests = this.endpoints.map((endpoint) =>
        this.spotifyService.getSpotifyData(endpoint)
      );
      this.shelvesData = await Promise.all(requests);
      console.log('shelvesData:', this.shelvesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
