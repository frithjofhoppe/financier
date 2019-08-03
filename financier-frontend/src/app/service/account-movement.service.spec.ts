import { TestBed } from '@angular/core/testing';

import { AccountMovementService } from './account-movement.service';

describe('AccountMovementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountMovementService = TestBed.get(AccountMovementService);
    expect(service).toBeTruthy();
  });
});
