import { UserFirebaseData, UserFolder } from './firebase.model';

export interface DialogRemovePlaylistData {
  name: string;
  id: string;
}

export interface DialogRemoveFolderData {
  userFirebaseData: UserFirebaseData;
  folder: UserFolder;
}
