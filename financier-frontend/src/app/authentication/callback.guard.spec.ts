import { TestBed, async, inject } from '@angular/core/testing';

import { CallbackGuard } from './callback.guard';

describe('CallbackGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CallbackGuard]
    });
  });

  it('should ...', inject([CallbackGuard], (guard: CallbackGuard) => {
    expect(guard).toBeTruthy();
  }));
});
