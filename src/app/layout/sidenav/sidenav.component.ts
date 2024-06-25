import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { DrawerService } from '../../services/drawer.service';
import { ListItemComponent } from './list-item/list-item.component';
import {
  Playlist,
  PlaylistsObject,
  TracksObject,
  UserProfile,
} from '../../models/spotify.model';
import { CloudService } from '../../services/cloud.service';
import { CustomButtonComponent } from '../../components/buttons/custom-button/custom-button.component';
import { ListLikedSongsComponent } from './list-liked-songs/list-liked-songs.component';
import { CustomScrollbarDirective } from '../../directives/custom-scrollbar.directive';
import { UserFirebaseData, UserFolder } from '../../models/firebase.model';
import { doc, onSnapshot } from 'firebase/firestore';
import { FirebaseService } from '../../services/firebase.service';
import { ListFolderComponent } from './list-folder/list-folder.component';
import { DraggableDirective } from '../../directives/draggable.directive';
import { DropTargetDirective } from '../../directives/drop-target.directive';
import { UtilsService } from '../../services/utils.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-sidenav',
  standalone: true,
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
export class SidenavComponent implements OnDestroy, OnInit {
  @Input() drawerSidenav!: MatDrawer;
  @Input() userProfile!: UserProfile;
  sidenavExpanded!: boolean;
  myPlaylists!: PlaylistsObject;
  myTracks!: TracksObject;
  private movedToFolderStatus!: boolean;
  private sidenavExpandedSubscription!: Subscription;
  private myPlaylistsSubscription!: Subscription;
  private myTracksSubscription!: Subscription;
  private dropActionSubscription!: Subscription;
  private movedToFolderStatusSubscription!: Subscription;
  private unsub!: () => void;
  public userFirebaseData!: UserFirebaseData;
  public folderUnassignedPlaylists!: Playlist[];
  private firestore: Firestore = inject(Firestore);

  constructor(
    private router: Router,
    private drawerService: DrawerService,
    private cloudService: CloudService,
    private firebaseService: FirebaseService,
    public utilsService: UtilsService
  ) {
    this.subscribeTo();
  }

  ngOnInit() {
    this.unsub = onSnapshot(
      doc(this.firestore, 'users', this.userProfile.id),
      (doc) => {
        this.userFirebaseData = doc.data() as UserFirebaseData;
        this.findUnassignedPlaylists();
      }
    );
  }

  ngOnDestroy(): void {
    this.sidenavExpandedSubscription.unsubscribe();
    this.myPlaylistsSubscription.unsubscribe();
    this.myTracksSubscription.unsubscribe();
    this.dropActionSubscription.unsubscribe();
    this.movedToFolderStatusSubscription.unsubscribe();
    this.unsub();
  }

  private subscribeTo(): void {
    this.sidenavExpandedSubscription = this.drawerService
      .observeSidenavExpanded()
      .subscribe((expanded: boolean) => {
        this.sidenavExpanded = expanded;
      });
    this.myPlaylistsSubscription = this.cloudService
      .observeMyPlaylists()
      .subscribe((playlists: PlaylistsObject) => {
        this.myPlaylists = playlists;
        this.findUnassignedPlaylists();
      });
    this.myTracksSubscription = this.cloudService
      .observeMyTracks()
      .subscribe((tracks: TracksObject) => {
        this.myTracks = tracks;
      });
    this.movedToFolderStatusSubscription = this.utilsService
      .observeToFolderStatus()
      .subscribe((movedToFolderStatus: boolean) => {
        this.movedToFolderStatus = movedToFolderStatus;
      });
  }

  public navigateTo(route: string, data?: UserProfile): void {
    if (data) {
      this.router.navigate([route], { state: { user: data } });
    } else {
      this.router.navigate([route]);
    }
  }

  private findUnassignedPlaylists(): void {
    if (!this.userFirebaseData) {
      return;
    }
    const folderAssignedPlaylistIds = new Set<string>();
    this.userFirebaseData.folders.forEach((folder: UserFolder) => {
      folder.playlists.forEach((assignedPlaylist: Playlist) => {
        folderAssignedPlaylistIds.add(assignedPlaylist.id);
      });
    });
    this.folderUnassignedPlaylists = this.myPlaylists.items.filter(
      (playlist) => !folderAssignedPlaylistIds.has(playlist.id)
    );
  }

  public removePlaylistFromFolders(playlistToRemove: Playlist): void {
    if (!this.movedToFolderStatus) {
      this.userFirebaseData.folders.forEach((folder: UserFolder) => {
        folder.playlists = folder.playlists.filter(
          (playlist) => playlist.id !== playlistToRemove.id
        );
      });
      this.firebaseService.updateDocument('users', this.userProfile.id, {
        folders: [...this.userFirebaseData.folders],
      });
    }
  }
}
