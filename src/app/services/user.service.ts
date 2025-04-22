import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { SpotifyService } from './spotify.service';
import { FirebaseService } from './firebase.service';
import { UserProfile } from '../models/spotify.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private spotifyService: SpotifyService,
    private firebaseService: FirebaseService,
  ) { }

  async getProfile(): Promise<UserProfile> {
    const profile = await lastValueFrom(this.spotifyService.getCurrentUsersProfile());
    this.firebaseService.checkUserInFirestore(profile);
    return profile;
  }

  async getUserId(profile?: UserProfile): Promise<string> {
    if (!profile) {
      const currentProfile = await this.getProfile();
      return currentProfile.id;
    }
    return profile.id;
  }
}
