import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { employerGuardGuard } from './employer-guard.guard';

describe('employerGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => employerGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
