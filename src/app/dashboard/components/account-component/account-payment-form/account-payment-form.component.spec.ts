import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPaymentFormComponent } from './account-payment-form.component';

describe('AccountPaymentFormComponent', () => {
  let component: AccountPaymentFormComponent;
  let fixture: ComponentFixture<AccountPaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccountPaymentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
