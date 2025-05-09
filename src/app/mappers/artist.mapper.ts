import { SpotifyArtistDto } from "../dto";
import { SpotifySimpleArtistDto } from "../dto/spotify-artist.dto";
import { Artist } from "../models";

export class ArtistMapper {
    public static toModel(dto: SpotifyArtistDto | SpotifySimpleArtistDto): Artist {
        if (ArtistMapper.isFullArtistDto(dto)) {
            return {
                id: dto.id,
                name: dto.name,
                imageUrl: dto.images?.[0]?.url || '',
                genres: dto.genres,
                followers: dto.followers.total
            };
        } else {
            return {
                id: dto.id,
                name: dto.name,
                imageUrl: '',
                genres: [],
                followers: 0
            };
        }
    }

    private static isFullArtistDto(dto: any): dto is SpotifyArtistDto {
        return dto.genres !== undefined && dto.followers !== undefined;
    }
}
