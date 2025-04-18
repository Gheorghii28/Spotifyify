import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { PlaylistsObject, UserProfile } from '../../models/spotify.model';
import { lastValueFrom, Subscription } from 'rxjs';
import { SpotifyService } from '../../services/spotify.service';
import { CardComponent } from '../../components/card/card.component';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { CloudService } from '../../services/cloud.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    CardComponent,
    CommonModule,
    ResizeObserverDirective,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnDestroy, OnInit {
  user!: UserProfile;
  playlists!: PlaylistsObject;

  private myPlaylistsSubscription!: Subscription;

  constructor(
    private spotifyService: SpotifyService,
    private cloudService: CloudService,
  ) {
    this.subscribeTo();
  }

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  ngOnDestroy(): void {
    this.myPlaylistsSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.myPlaylistsSubscription = this.cloudService
      .observeMyPlaylists()
      .subscribe((playlists: PlaylistsObject) => {
        this.playlists = playlists;
      });
  }

  public async fetchUserProfile(): Promise<void> {
    try {
      const user: UserProfile = await lastValueFrom(
        this.spotifyService.getCurrentUsersProfile()
      );
      this.user = user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
  
}
