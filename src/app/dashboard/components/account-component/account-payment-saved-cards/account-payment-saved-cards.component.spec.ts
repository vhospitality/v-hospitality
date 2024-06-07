import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPaymentSavedCardsComponent } from './account-payment-saved-cards.component';

describe('AccountPaymentSavedCardsComponent', () => {
  let component: AccountPaymentSavedCardsComponent;
  let fixture: ComponentFixture<AccountPaymentSavedCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccountPaymentSavedCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountPaymentSavedCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
