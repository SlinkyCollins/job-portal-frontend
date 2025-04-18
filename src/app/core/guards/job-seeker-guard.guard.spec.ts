import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { jobSeekerGuardGuard } from './job-seeker-guard.guard';

describe('jobSeekerGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => jobSeekerGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
