
import { SpotifyUserDto } from "../dto";
import { User } from "../models";

export class UserMapper {
  public static toModel(userDto: SpotifyUserDto): User {
    return {
      id: userDto.id,
      name: userDto.display_name,
      email: userDto.email,
      country: userDto.country,
      imageUrl: userDto.images[0].url,
      folders: [], // Initialize with an empty array or fetch from Firestore
    };
  }

  public static toJSON(userDto: SpotifyUserDto): User {
    return {
      id: userDto.id,
      name: userDto.display_name,
      email: userDto.email,
      country: userDto.country,
      imageUrl: userDto.images[0].url,
      folders: []
    };
  }
}