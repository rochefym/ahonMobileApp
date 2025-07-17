import { TestBed } from '@angular/core/testing';

import { DetectionApiResponseService } from './detection-api-response.service';

describe('DetectionApiResponseService', () => {
  let service: DetectionApiResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetectionApiResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
