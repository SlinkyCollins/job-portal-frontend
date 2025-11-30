import { TestBed } from '@angular/core/testing';

import { ProfileRefreshService } from './profile-refresh.service';

describe('ProfileRefreshService', () => {
  let service: ProfileRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileRefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
