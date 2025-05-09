import { TestBed } from '@angular/core/testing';

import { LikedTracksService } from './liked-tracks.service';

describe('LikedTracksService', () => {
  let service: LikedTracksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikedTracksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
