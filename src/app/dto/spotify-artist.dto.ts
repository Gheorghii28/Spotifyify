import { SpotifyExternalUrlsDto } from "./spotify-external.dto";
import { SpotifyImageDto } from "./spotify-image.dto";

export interface SpotifyArtistDto {
    external_urls: SpotifyExternalUrlsDto;
    followers: {
        href: string;
        total: number;
    };
    genres: string[];
    href: string;
    id: string;
    images: SpotifyImageDto[] | null;
    name: string;
    popularity: number;
    type: string;
    uri: string;
}

export interface SpotifySimpleArtistDto {
    external_urls: SpotifyExternalUrlsDto;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}
