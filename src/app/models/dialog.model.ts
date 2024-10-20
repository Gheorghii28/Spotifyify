import { UserFirebaseData, UserFolder } from './firebase.model';

export interface DialogRemovePlaylistData {
  name: string;
  id: string;
}
export interface DialogChangePlaylistDetailsData {
  id: string;
  name: string;
  description: string;
}

export interface DialogRemoveFolderData {
  userFirebaseData: UserFirebaseData;
  folder: UserFolder;
}

export interface DialogRemoveTrackData {
  playlistId: string;
  snapshot_id: string;
  uri: string;
}

export interface DialogAddTrackData {
  position: number;
  uri: string;
}
