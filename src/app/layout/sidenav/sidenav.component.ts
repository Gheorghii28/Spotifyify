import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { MatDrawer } from '@angular/material/sidenav';
import { ListItemComponent } from './list-item/list-item.component';
import { CustomButtonComponent } from '../../components/buttons/custom-button/custom-button.component';
import { ListLikedSongsComponent } from './list-liked-songs/list-liked-songs.component';
import { CustomScrollbarDirective } from '../../directives/custom-scrollbar.directive';
import { ListFolderComponent } from './list-folder/list-folder.component';
import { DraggableDirective } from '../../directives/draggable.directive';
import { DropTargetDirective } from '../../directives/drop-target.directive';
import { Subject } from 'rxjs';
import { Playlist } from '../../models';
import { DrawerService, LayoutService, LikedTracksService, NavigationService, UserService, UtilsService } from '../../services';
import { PlaylistManagerService } from '../services/playlist-manager.service';
import { UserFolder } from '../../models/user.model';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';

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
    SkeletonComponent,
    DraggableDirective,
    DropTargetDirective,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnDestroy {
  public userService = inject(UserService);
  private likedTracksService = inject(LikedTracksService);
  private utilsService = inject(UtilsService);
  private playlistManager = inject(PlaylistManagerService);
  private navigationService = inject(NavigationService);
  private drawerService = inject(DrawerService);
  private layoutService = inject(LayoutService);

  @Input() drawerSidenav!: MatDrawer;
  @Input() sidenavExpanded!: boolean;
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

  async ngOnInit(): Promise<void> {
    this.playlistManager.setMyPlaylists();
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
      this.playlistManager.updatePlaylistInFolder(
        this.playlistManager.folders(),
        playlistToRemove,
        null,
        this.userService.user()!.id,
        'remove'
      );
    }
  }

  toJson(playlist: any): string {
    return this.utilsService.toJsonString(playlist);
  }

  public get likedCount(): number {
    return this.likedTracksService.likedCount();
  }

  public get myPlaylists(): Playlist[] {
    return this.playlistManager.myPlaylists();
  }

  public get folderAssignedPlaylists(): Playlist[] {
    return this.playlistManager.assignedPlaylists();
  }

  public get folderUnassignedPlaylists(): Playlist[] {
    return this.playlistManager.unassignedPlaylists();
  }

  public get sidenavWidth(): number {
    return this.drawerService.sidenavWidth()!;
  }

  public get folders(): UserFolder[] {
    return this.playlistManager.folders()!;
  }

  public get isFolderLoading(): boolean {
    return this.playlistManager.isFolderLoading()!;
  }

  public get trackListHeight(): number {
    return this.layoutService.trackListHeight;
  }
}
