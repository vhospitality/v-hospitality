import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordRequestVerificationComponent } from './forgot-password-request-verification.component';

describe('ForgotPasswordRequestVerificationComponent', () => {
  let component: ForgotPasswordRequestVerificationComponent;
  let fixture: ComponentFixture<ForgotPasswordRequestVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ForgotPasswordRequestVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordRequestVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
