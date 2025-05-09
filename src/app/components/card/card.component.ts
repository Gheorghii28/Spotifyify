import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { BtnPlayComponent } from '../buttons/btn-play/btn-play.component';
import { Playlist } from '../../models';
import { NavigationService, UtilsService } from '../../services';

@Component({
  selector: 'app-card',
  imports: [MatCardModule, CommonModule, BtnPlayComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  utilsService = inject(UtilsService);
  navigationService = inject(NavigationService);

  @Input() playlist!: Playlist;

  navigateToPlaylist(id: string): void {
    this.navigationService.playlist(id);
  }

  public get imgUrl(): string {
    return this.playlist?.imageUrl ?? '../../../assets/img/music-file.png';
  }
}
