import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMovementComponent } from './account-movement.component';

describe('AccountMovementComponent', () => {
  let component: AccountMovementComponent;
  let fixture: ComponentFixture<AccountMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
