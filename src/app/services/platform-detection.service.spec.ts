import { TestBed } from '@angular/core/testing';

import { PlatformDetectionService } from './platform-detection.service';

describe('PlatformDetectionService', () => {
  let service: PlatformDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
