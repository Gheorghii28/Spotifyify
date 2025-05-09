import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User } from '../../../models';

@Component({
  selector: 'app-profile-header',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  @Input() user!: User;
  @Input() playlistCount!: number;
}
