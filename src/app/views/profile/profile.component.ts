import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { UserProfile } from '../../models/spotify.model';
import { lastValueFrom } from 'rxjs';
import { SpotifyService } from '../../services/spotify.service';
import { CardComponent } from '../../components/card/card.component';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { CloudService } from '../../services/cloud.service';

@Component({
  selector: 'app-profile',
  imports: [
    ProfileHeaderComponent,
    CardComponent,
    CommonModule,
    ResizeObserverDirective,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user!: UserProfile;

  constructor(
    private spotifyService: SpotifyService,
    public cloudService: CloudService,
  ) { }

  ngOnInit(): void {
    this.fetchUserProfile();
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
