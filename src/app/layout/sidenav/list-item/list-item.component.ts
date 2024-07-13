import { Component, Input, ViewChild } from '@angular/core';
import { Playlist } from '../../../models/spotify.model';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { DrawerService } from '../../../services/drawer.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogRemovePlaylistComponent } from '../../../components/dialog/dialog-remove-playlist/dialog-remove-playlist.component';
import { CustomButtonComponent } from '../../../components/buttons/custom-button/custom-button.component';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, MatMenuModule, CustomButtonComponent],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
})
export class ListItemComponent {
  @Input() playlist!: Playlist;
  @Input() sidenavExpanded!: boolean;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  public sidenavWidth!: number;
  public contextMenuPosition = { x: '0px', y: '0px' };
  private sidenavWidthSubscription!: Subscription;
  public btnExpandedStyles = { width: '100%', padding: '8px' };
  public btnCollapsedStyles = { width: '48px', padding: 0 };
  
  constructor(
    private drawerService: DrawerService,
    private router: Router,
    private dialog: MatDialog,
    public utilsService: UtilsService
  ) {
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.sidenavWidthSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.sidenavWidthSubscription = this.drawerService
      .observeSidenavWidth()
      .subscribe((width: number) => {
        this.sidenavWidth = width;
      });
  }

  public onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu.menu) {
      this.contextMenu.menu.focusFirstItem('mouse');
    }
    this.contextMenu.openMenu();
  }

  public navigateToPlaylist(): void {
    this.router.navigate(['/playlist', this.playlist.id]);
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(DialogRemovePlaylistComponent, {
      data: { name: this.playlist.name, id: this.playlist.id },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
