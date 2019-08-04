import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMovementEditComponent } from './account-movement-edit.component';

describe('AccountMovementEditComponent', () => {
  let component: AccountMovementEditComponent;
  let fixture: ComponentFixture<AccountMovementEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMovementEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMovementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
