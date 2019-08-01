import { TestBed } from '@angular/core/testing';

import { AuthenticationProcessService } from './authentication-process.service';

describe('AuthenticationProcessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthenticationProcessService = TestBed.get(AuthenticationProcessService);
    expect(service).toBeTruthy();
  });
});
