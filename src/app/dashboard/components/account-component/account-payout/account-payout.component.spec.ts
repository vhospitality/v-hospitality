import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPayoutComponent } from './account-payout.component';

describe('AccountPayoutComponent', () => {
  let component: AccountPayoutComponent;
  let fixture: ComponentFixture<AccountPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccountPayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
