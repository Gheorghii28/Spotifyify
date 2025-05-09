import { SpotifyTrackDto } from "./spotify-track.dto";

export interface SpotifyUserSavedTracksDto {
    href: string;
    items: SpotifyUserSavedTrackItemDto[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}

export interface SpotifyUserSavedTrackItemDto {
    added_at: string;
    track: SpotifyTrackDto;
}