import { TestBed } from '@angular/core/testing';

import { PersonDetectionModelStateService } from './person-detection-model-state.service';

describe('PersonDetectionModelStateService', () => {
  let service: PersonDetectionModelStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonDetectionModelStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
