import { Component, Input, ViewChild } from '@angular/core';
import { CustomButtonComponent } from '../../../components/buttons/custom-button/custom-button.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { UserFirebaseData, UserFolder } from '../../../models/firebase.model';
import { Playlist } from '../../../models/spotify.model';
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
import { UtilsService } from '../../../services/utils.service';
import { FirebaseService } from '../../../services/firebase.service';
import { DropTargetDirective } from '../../../directives/drop-target.directive';
import { MatDialog } from '@angular/material/dialog';
import { DialogRemoveFolderComponent } from '../../../components/dialog/dialog-remove-folder/dialog-remove-folder.component';
import { DialogRenameFolderComponent } from '../../../components/dialog/dialog-rename-folder/dialog-rename-folder.component';

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
  @Input() folder!: UserFolder;
  @Input() playlists!: Playlist[];
  @Input() userFirebaseData!: UserFirebaseData;
  @Input() sidenavExpanded!: boolean;
  @Input() movedToFolderStatus!: boolean;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  public sidenavWidth!: number;
  public contextMenuPosition = { x: '0px', y: '0px' };
  public panelOpenState = false;
  public btnExpandedStyles = { width: '100%', padding: '8px' };
  public btnCollapsedStyles = { width: '48px', padding: 0 };

  constructor(
    public utilsService: UtilsService,
    private firebaseService: FirebaseService,
    private dialog: MatDialog
  ) { }

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
      data: { userFirebaseData: this.userFirebaseData, folder: this.folder },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openRenameDialog(): void {
    const dialogRef = this.dialog.open(DialogRenameFolderComponent, {
      data: { folderName: this.folder.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.trim()) {
        const folderToUpdate = this.userFirebaseData.folders.find((folder) => folder.id === this.folder.id);
    
        if (folderToUpdate) {
          folderToUpdate.name = result.trim();
          this.firebaseService.updateDocument('users', this.userFirebaseData.userId, this.userFirebaseData)
            .then(() => {
              console.log('Folder name updated successfully');
            })
            .catch((error) => {
              console.error('Error updating folder name:', error);
            });
        } else {
          console.error('Folder not found with id:', this.folder.id);
        }
      } else {
        console.warn('No valid folder name provided.');
      }
    });    
  }

  public movePlaylistToFolder(
    playlistToMove: Playlist,
    destinationFolderId: string
  ): void {
    this.userFirebaseData.folders.forEach((folder: UserFolder) => {
      folder.playlists = folder.playlists.filter(
        (playlist: Playlist) => playlist.id !== playlistToMove.id
      );
      if (folder.id === destinationFolderId) {
        folder.playlists.push(playlistToMove);
      }
    });
    this.firebaseService.updateDocument('users', this.userFirebaseData.userId, {
      folders: [...this.userFirebaseData.folders],
    });
    this.utilsService.setMovedToFolderStatus(true);
    setTimeout(() => {
      this.utilsService.setMovedToFolderStatus(false);
    }, 1000);
  }
}
