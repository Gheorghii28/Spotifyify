import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SpotifyService } from './spotify.service';
import { FirebaseService } from './firebase.service';
import { User } from '../models';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private spotifyService = inject(SpotifyService);
  private firebaseService = inject(FirebaseService);
  
  user: WritableSignal<User | undefined> = signal(undefined);

  async syncUserOnInit(): Promise<User> {
    const spotifyUser: User = await firstValueFrom(
      this.spotifyService.getCurrentUserAsJson()
    );

    const exists = await this.checkUserExists(spotifyUser.id);
    if (!exists) {
      this.user.set(spotifyUser);
      await this.createUserInFirestore(spotifyUser);
      return spotifyUser;
    } else {
      const user = await this.firebaseService.getDocument<User>('users', spotifyUser.id) as User;
      this.user.set(user);
      return user;
    }
  }

  private async checkUserExists(userId: string): Promise<boolean> {
    return await this.firebaseService.checkDocumentExists('users', userId);
  }

  private async createUserInFirestore(user: User): Promise<void> {
    await this.firebaseService.setDocument('users', user.id, user);
  }
}
