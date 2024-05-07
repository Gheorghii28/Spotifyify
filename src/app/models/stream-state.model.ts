export interface StreamState {
  playing: boolean;
  readableCurrentTime: string;
  readableDuration: string;
  duration: number;
  currentTime: number;
  canplay: boolean;
  error: boolean;
}

export interface PlayingTrack {
  playListId: string;
  id: string;
  index: number;
}

export class PlayingTrackClass implements PlayingTrack {
  playListId: string;
  id: string;
  index: number;

  constructor(playListId: string, id: string, index: number) {
    this.playListId = playListId;
    this.id = id;
    this.index = index;
  }
}
