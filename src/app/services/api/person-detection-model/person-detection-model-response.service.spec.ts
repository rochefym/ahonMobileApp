import { TestBed } from '@angular/core/testing';

import { PersonDetectionModelResponseService } from './person-detection-model-response.service';

describe('PersonDetectionModelResponseService', () => {
  let service: PersonDetectionModelResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonDetectionModelResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
