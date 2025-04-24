import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { MatDrawer } from '@angular/material/sidenav';
import { ListItemComponent } from './list-item/list-item.component';
import { Playlist, PlaylistsObject } from '../../models/spotify.model';
import { CustomButtonComponent } from '../../components/buttons/custom-button/custom-button.component';
import { ListLikedSongsComponent } from './list-liked-songs/list-liked-songs.component';
import { CustomScrollbarDirective } from '../../directives/custom-scrollbar.directive';
import { UserFirebaseData } from '../../models/firebase.model';
import { FirebaseService } from '../../services/firebase.service';
import { ListFolderComponent } from './list-folder/list-folder.component';
import { DraggableDirective } from '../../directives/draggable.directive';
import { DropTargetDirective } from '../../directives/drop-target.directive';
import { UtilsService } from '../../services/utils.service';
import { PlaylistManagerService } from '../services/playlist-manager.service';
import { NavigationService } from '../../services/navigation.service';
import { Subject } from 'rxjs';
import { DrawerService } from '../../services/drawer.service';

@Component({
  selector: 'app-sidenav',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    NavHeaderComponent,
    ListItemComponent,
    CustomButtonComponent,
    ListLikedSongsComponent,
    CustomScrollbarDirective,
    ListFolderComponent,
    DraggableDirective,
    DropTargetDirective,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnDestroy {
  @Input() drawerSidenav!: MatDrawer;
  @Input() sidenavExpanded!: boolean;
  @Input() myPlaylists!: PlaylistsObject;
  @Input() userFirebaseData!: UserFirebaseData;
  @Input() folderUnassignedPlaylists!: Playlist[];
  @Input() myTracksTotal!: number;
  @Input() movedToFolderStatus!: boolean;

  public navExpandedStyles = { 'padding-left': '15px' };
  public navCollapsedStyles = {
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
  };
  public listExpandedStyles = {};
  public listCollapsedStyles = { 'align-items': 'center' };
  public liFolderExpandedStyles = {};
  public liFolderCollapsedStyles = { width: '48px' };
  private destroy$ = new Subject<void>();

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    private playlistManagerService: PlaylistManagerService,
    public navigationService: NavigationService,
    public drawerService: DrawerService,
  ) {
    this.subscribeTo();
  }

  private subscribeTo(): void {
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goHome(): void {
    this.navigationService.home();
  }

  goToSearch(): void {
    this.navigationService.search();
  }
  
  public removePlaylistFromFolders(playlistToRemove: Playlist): void {
    if (!this.movedToFolderStatus) {
      const updatedFolders = this.playlistManagerService.removePlaylistFromAllFolders(
        this.userFirebaseData,
        playlistToRemove.id
      );
      this.firebaseService.updateDocument('users', this.userFirebaseData.userId, {
        folders: updatedFolders,
      });
    }
  }

  toJson(playlist: any): string {
    return this.utilsService.toJsonString(playlist);
  }
}
