import { SpotifyUserPlaylistItemDto } from "./spotify-playlist.dto";

export interface SpotifyUserPlaylistsDto {
    href: string;
    items: SpotifyUserPlaylistItemDto[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  }