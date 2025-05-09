import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { CardComponent } from '../../components/card/card.component';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { Playlist, User } from '../../models';
import { UserService } from '../../services';
import { PlaylistManagerService } from '../../layout/services/playlist-manager.service';

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
export class ProfileComponent {
  private userService = inject(UserService);
  private playlistManager = inject(PlaylistManagerService);

  public get user(): User {
    return this.userService.user()!;
  }

  public get myPlaylists(): Playlist[] {
    return this.playlistManager.myPlaylists()!;
  }
}
