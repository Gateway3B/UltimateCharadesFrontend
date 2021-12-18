import { TestBed } from '@angular/core/testing';

import { CharadesService } from './charades.service';

describe('CharadesService', () => {
  let service: CharadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
