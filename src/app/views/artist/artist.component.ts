import { Component, inject, OnInit } from '@angular/core';
import { ArtistHeaderComponent } from './artist-header/artist-header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { PageInProgressComponent } from '../../components/page-in-progress/page-in-progress.component';
import { Artist } from '../../models';
import { SpotifyService } from '../../services';

@Component({
  selector: 'app-artist',
  imports: [
    ArtistHeaderComponent,
    PageInProgressComponent,
    CommonModule,
    ResizeObserverDirective,
  ],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.scss'
})
export class ArtistComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private spotifyService = inject(SpotifyService);

  artist!: Artist;

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const artistId = params['id'];
      const artistIds: string[] = [artistId];
      const artistResults = await lastValueFrom(
        this.spotifyService.getArtist(artistIds)
      );
      this.artist = artistResults[0];
      const albums = await lastValueFrom(
        this.spotifyService.getArtistAlbums(artistId)
      );
      const topTracks = await lastValueFrom(
        this.spotifyService.getArtistAlbums(artistId)
      );
    });
  }
}
