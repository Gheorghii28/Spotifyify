import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CustomButtonComponent } from '../../buttons/custom-button/custom-button.component';
import { DrawerService } from '../../../services/drawer.service';
import { TrackFile } from '../../../models/cloud.model';
import { Playlist } from '../../../models/spotify.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    CommonModule,
    CustomButtonComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() track!: TrackFile;
  @Input() playlist!: Playlist;
  constructor(private drawerService: DrawerService) {}

  public closePlayingInfo(): void {
    this.drawerService.setdrawerEndStatus(false);
  }

  public clickEventFunction(): void {}

  public getDisplayName(): string {
    return this.playlist ? this.playlist.name : this.track?.name || '';
  }
}
