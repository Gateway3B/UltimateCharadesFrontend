import { TestBed } from '@angular/core/testing';

import { SessionIdGuard } from './session-id.guard';

describe('SessionIdGuard', () => {
  let guard: SessionIdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SessionIdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
