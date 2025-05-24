import { Album } from "./album.model";
import { Artist } from "./artist.model";
import { Playlist } from "./playlist.model";
import { Track } from "./track.model";

export interface SearchResults {
  playlists: Playlist[];
  albums: Album[];
  artists: Artist[];
  tracks: Track[];
}