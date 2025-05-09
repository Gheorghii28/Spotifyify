import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { Artist } from '../../../models';
import { NavigationService, SpotifyService, UtilsService } from '../../../services';

@Component({
  selector: 'app-artist-info',
  imports: [CommonModule],
  templateUrl: './artist-info.component.html',
  styleUrl: './artist-info.component.scss',
})
export class ArtistInfoComponent {
  private utilsService = inject(UtilsService);
  private spotifyService = inject(SpotifyService);
  private navigationService = inject(NavigationService)
  @Input() artist!: Artist;
  isFollowing!: boolean;
  description: string =
    'text Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti, nihil. Error explicabo, saepe dolorem sapiente odit, natus at aspernatur impedit repellat minima similique. Tempora sint repellat a possimus, nobis atque?';

  public getArtistImageUrl(artist: Artist): string {
    return artist.imageUrl || '';
  }

  public truncateDescription(): string {
    return this.utilsService.truncateText(this.description, 100);
  }

  public navigateToArtist(id: string): void {
    this.navigationService.artist(id);
  }

  public async toggleFollowing(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const isFollow = await lastValueFrom(
      this.spotifyService.checkIfCurrentUserFollowsArtistsorUsers([this.artist.id], 'artist')
    );
    this.isFollowing = isFollow[0];
    if(this.isFollowing) {
      await lastValueFrom(this.spotifyService.unfollowArtistsorUsers([this.artist.id], 'artist'));
    } else {
      await lastValueFrom(this.spotifyService.followArtistsorUsers([this.artist.id], 'artist'));
    }
  }
}
