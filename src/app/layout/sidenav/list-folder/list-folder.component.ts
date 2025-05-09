import { Component, inject, Input, ViewChild } from '@angular/core';
import { CustomButtonComponent } from '../../../components/buttons/custom-button/custom-button.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ListItemComponent } from '../list-item/list-item.component';
import { MatListModule } from '@angular/material/list';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DraggableDirective } from '../../../directives/draggable.directive';
import { DropTargetDirective } from '../../../directives/drop-target.directive';
import { MatDialog } from '@angular/material/dialog';
import { DialogRemoveFolderComponent } from '../../../components/dialog/dialog-remove-folder/dialog-remove-folder.component';
import { DialogRenameFolderComponent } from '../../../components/dialog/dialog-rename-folder/dialog-rename-folder.component';
import { Playlist } from '../../../models';
import { User, UserFolder } from '../../../models/user.model';
import { PlaylistManagerService } from '../../services/playlist-manager.service';
import { DrawerService, UserService, UtilsService } from '../../../services';

@Component({
  selector: 'app-list-folder',
  imports: [
    CommonModule,
    MatMenuModule,
    CustomButtonComponent,
    MatExpansionModule,
    MatListModule,
    ListItemComponent,
    DraggableDirective,
    DropTargetDirective,
  ],
  templateUrl: './list-folder.component.html',
  styleUrl: './list-folder.component.scss',
  animations: [
    trigger('expandCollapse', [
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
          overflow: 'hidden',
        })
      ),
      state(
        'collapsed',
        style({
          height: '0px',
          opacity: 0,
          overflow: 'hidden',
        })
      ),
      transition('expanded <=> collapsed', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class ListFolderComponent {
  private playlistManager = inject(PlaylistManagerService);
  private userService = inject(UserService);
  private utilsService = inject(UtilsService);
  private drawerService = inject(DrawerService);
  private dialog = inject(MatDialog);

  @Input() folder!: UserFolder;
  @Input() playlists!: Playlist[];
  @Input() user!: User;
  @Input() sidenavExpanded!: boolean;
  @Input() movedToFolderStatus!: boolean;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  public contextMenuPosition = { x: '0px', y: '0px' };
  public panelOpenState = false;
  public btnExpandedStyles = { width: '100%', padding: '8px' };
  public btnCollapsedStyles = { width: '48px', padding: 0 };

  public onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu.menu) {
      this.contextMenu.menu.focusFirstItem('mouse');
    }
    this.contextMenu.openMenu();
  }

  public togglePanelState(): void {
    this.panelOpenState = !this.panelOpenState;
  }

  public openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DialogRemoveFolderComponent, {
      data: { user: this.user, folder: this.folder },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  public openRenameDialog(): void {
    const dialogRef = this.dialog.open(DialogRenameFolderComponent, {
      data: { folderName: this.folder.name },
    });

    dialogRef.afterClosed().subscribe((newName) => {
      if (newName && newName.trim()) {
        const user = this.userService.user()!;
        this.playlistManager.renamePlaylistFolder(user?.id, this.folder.id, newName);
      } else {
        console.warn('No valid folder name provided.');
      }
    });
  }

  public movePlaylistToFolder(
    playlistToMove: Playlist,
    destinationFolderId: string
  ): void {
    const user = this.userService.user()!;
    this.playlistManager.updatePlaylistInFolder(
      this.playlistManager.folders(),
      playlistToMove,
      destinationFolderId,
      user.id,
      'add'
    );
    this.utilsService.setMovedToFolderStatus(true);
    setTimeout(() => {
      this.utilsService.setMovedToFolderStatus(false);
    }, 1000);
  }

  public get sidenavWidth(): number {
    return this.drawerService.sidenavWidth()!;
  }

  public truncateText(value: string): string {
    return this.utilsService.truncateText(value, 22);
  }

  public toJsonString(value: any): string {
    return this.utilsService.toJsonString(value);
  }
}
