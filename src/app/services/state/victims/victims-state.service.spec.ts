import { TestBed } from '@angular/core/testing';

import { VictimsStateService } from './victims-state.service';

describe('VictimsStateService', () => {
  let service: VictimsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VictimsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
