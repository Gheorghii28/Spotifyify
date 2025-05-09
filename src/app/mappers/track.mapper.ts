import { SpotifyTrackDto } from "../dto";
import { Track } from "../models";
import { ArtistMapper } from "./artist.mapper";

export class TrackMapper {
  public static toModel(
    trackDto: SpotifyTrackDto,
    index: number = 0
  ): Track {
    return {
      id: trackDto.id,
      name: trackDto.name,
      artists: trackDto.artists.map(artistDto => ArtistMapper.toModel(artistDto)),
      albumName: trackDto.album?.name || null,
      albumImageUrl: trackDto.album?.images?.[0]?.url || null,
      durationMs: trackDto.duration_ms,
      previewUrl: trackDto.preview_url,
      uri: trackDto.uri,
      index
    };
  }
}
