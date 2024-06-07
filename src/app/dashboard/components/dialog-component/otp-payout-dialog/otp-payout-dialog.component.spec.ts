import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpPayoutDialogComponent } from './otp-payout-dialog.component';

describe('OtpPayoutDialogComponent', () => {
  let component: OtpPayoutDialogComponent;
  let fixture: ComponentFixture<OtpPayoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OtpPayoutDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpPayoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
