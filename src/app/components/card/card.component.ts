import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Playlist } from '../../models/spotify.model';
import { Router } from '@angular/router';
import { BtnPlayComponent } from '../buttons/btn-play/btn-play.component';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, BtnPlayComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() data!: Playlist;

  constructor(private router: Router, public utilsService: UtilsService) {}

  navigateToPlaylist(id: string): void {
    this.router.navigate(['/playlist', id]);
  }
}
