import { TestBed } from '@angular/core/testing';

import { PlaylistQueryService } from './playlist-query.service';

describe('PlaylistQueryService', () => {
  let service: PlaylistQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaylistQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
