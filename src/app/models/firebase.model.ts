import { Playlist } from './spotify.model';

export interface UserFirebaseData {
  userId: string;
  folders: UserFolder[];
}

export class UserDataClass implements UserFirebaseData {
  userId: string;
  folders: UserFolder[];

  constructor(userId: string) {
    this.userId = userId;
    this.folders = [];
  }

  toJSON(): UserFirebaseData {
    return {
      userId: this.userId,
      folders: [...this.folders],
    };
  }
}

export interface UserFolder {
  id: string;
  name: string;
  playlists: Playlist[];
}

export class UserFolderClass implements UserFolder {
  id: string;
  name: string;
  playlists: Playlist[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.playlists = [];
  }
}
