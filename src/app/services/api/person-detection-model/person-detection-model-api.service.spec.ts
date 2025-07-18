import { TestBed } from '@angular/core/testing';

import { PersonDetectionModelApiService } from './person-detection-model-api.service';

describe('PersonDetectionModelApiService', () => {
  let service: PersonDetectionModelApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonDetectionModelApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
