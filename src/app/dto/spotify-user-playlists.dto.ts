import { SpotifyPlaylistDto } from "./spotify-playlist.dto";

export interface SpotifyUserPlaylistsDto {
    href: string;
    items: SpotifyPlaylistDto[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  }