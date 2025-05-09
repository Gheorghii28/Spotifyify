import { SpotifyAlbumDto } from "../dto";
import { Album } from "../models";
import { ArtistMapper } from "./artist.mapper";

export class AlbumMapper {
    public static toModel(albumDto: SpotifyAlbumDto): Album {
        return {
            id: albumDto.id,
            name: albumDto.name,
            artists: albumDto.artists.map(artistDto => ArtistMapper.toModel(artistDto)),
            imageUrl: albumDto.images?.[0]?.url || '',
            releaseDate: albumDto.release_date,
            totalTracks: albumDto.total_tracks
        };
    }
}
