import { Component, Input } from '@angular/core';
import { UserProfile } from '../../../models/spotify.model';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-header',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  @Input() data!: UserProfile;
  @Input() playlistCount!: number;
}
