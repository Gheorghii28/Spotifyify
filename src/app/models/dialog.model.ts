import { Track } from "./track.model";
import { User, UserFolder } from "./user.model";


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
  user: User;
  folder: UserFolder;
}

export interface DialogRemoveTrackData {
  playlistId: string;
  snapshot_id: string;
  uri: string;
  trackId: string;
}

export interface DialogAddTrackData {
  position: number;
  uri: string;
  track: Track
}
