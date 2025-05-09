import { SpotifyExternalUrlsDto } from "./spotify-external.dto";

export interface SpotifyOwnerDto {
    display_name: string;
    external_urls: SpotifyExternalUrlsDto;
    href: string;
    id: string;
    type: string;
    uri: string;
}