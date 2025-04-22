import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Playlist } from '../../models/spotify.model';
import { BtnPlayComponent } from '../buttons/btn-play/btn-play.component';
import { UtilsService } from '../../services/utils.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-card',
  imports: [MatCardModule, CommonModule, BtnPlayComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() data!: Playlist;

  constructor(public utilsService: UtilsService, public navigationService: NavigationService) {}

  navigateToPlaylist(id: string): void {
    this.navigationService.playlist(id);
  }

  public get imgUrl(): string {
    return this.data?.images?.[0]?.url ?? '../../../assets/img/music-file.png';
  }
}
