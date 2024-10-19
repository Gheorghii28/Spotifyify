import { TestBed } from '@angular/core/testing';

import { LikedStatusService } from './liked-status.service';

describe('LikedStatusService', () => {
  let service: LikedStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikedStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
