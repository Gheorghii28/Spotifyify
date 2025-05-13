import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../../../components/buttons/custom-button/custom-button.component';
import { Playlist } from '../../../models';
import { PlaylistManagerService } from '../../services/playlist-manager.service';
import { DrawerService, LayoutService, UserService } from '../../../services';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-nav-header',
  imports: [
    MatButtonModule,
    MatMenuModule,
    CommonModule,
    CustomButtonComponent,
  ],
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.scss',
})
export class NavHeaderComponent {
  private playlistManager = inject(PlaylistManagerService);
  private userService = inject(UserService);
  private drawerService = inject(DrawerService);
  private layoutService = inject(LayoutService);
  private snackbar = inject(SnackbarService);

  @Input() drawerSidenav!: MatDrawer;
  @Input() sidenavExpanded!: boolean;
  @Input() myPlaylists!: Playlist[];
  @Input() sidenavWidth!: number;

  public toggleDrawer(): void {
    const newExpandedState = !this.sidenavExpanded;
    const newDrawerEndState = this.sidenavExpanded;
    if (this.layoutService.isWindowWidthLessThan(1008)) {
      this.drawerService.isDrawerInfoOpened.set(newDrawerEndState);
    }
    this.drawerService.sidenavExpanded.set(newExpandedState);
  }

  public toggleSidenavWidth(): void {
    const newWidth = this.sidenavWidth === 631 ? 289 : 631;
    this.drawerService.sidenavWidth.set(newWidth);
    this.drawerService.updateDrawerEndStatusBasedOnSidenavWidth(newWidth);
  }

  public async createNewPlaylist(): Promise<void> {
    const user = this.userService.user()!;
    await this.snackbar.runWithSnackbar(
      this.playlistManager.createPlaylist(user.id),
      'Playlist created successfully!'
    );
  }

  public async createPlaylistFolder(): Promise<void> {
    const user = this.userService.user()!;
    await this.snackbar.runWithSnackbar(
      this.playlistManager.createPlaylistFolder(user.id),
      'Folder created successfully!'
    );
  }

  public isWindowWidthLessThan(value: number): boolean {
    return this.layoutService.isWindowWidthLessThan(value);
  }
}
