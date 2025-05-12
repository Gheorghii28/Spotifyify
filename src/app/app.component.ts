import { Component, inject, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { doc, onSnapshot } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { User } from './models';
import { UserService } from './services';
import { AuthService } from './auth/services/auth.service';
import { PlaylistManagerService } from './layout/services/playlist-manager.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private playlistManager = inject(PlaylistManagerService);
  
  constructor(@Inject('APP_INIT') private initFn: () => void) {
    this.initFn();
    if (this.authService.isAuthenticated()) {
      this.userService.syncUserOnInit().then((user) => {

        if (!user) {
          return;
        }

        const userDocRef = doc(this.firestore, 'users', user.id);
        const unsub = onSnapshot(userDocRef, (doc) => {
          const user = doc.data() as User;
          this.playlistManager.setFolders(user.folders);
        });

        this.authService.setUserUnsubscribe(unsub);
      }).catch((error) => {
        console.error('Error syncing user on init:', error);
      });
    } else {
      console.log('User not authenticated. Skip sync.');
    }
  }
}
