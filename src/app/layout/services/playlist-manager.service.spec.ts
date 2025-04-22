import { TestBed } from '@angular/core/testing';

import { PlaylistManagerService } from './playlist-manager.service';

describe('PlaylistManagerService', () => {
  let service: PlaylistManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaylistManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
