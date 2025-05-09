
import { SpotifyExternalUrlsDto } from "./spotify-external.dto";
import { SpotifyImageDto } from "./spotify-image.dto";

export interface SpotifyUserDto {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
      filter_enabled: boolean;
      filter_locked: boolean;
    };
    external_urls: SpotifyExternalUrlsDto;
    followers: { href: string; total: number };
    href: string;
    id: string;
    images: SpotifyImageDto[];
    product: string;
    type: string;
    uri: string;
}