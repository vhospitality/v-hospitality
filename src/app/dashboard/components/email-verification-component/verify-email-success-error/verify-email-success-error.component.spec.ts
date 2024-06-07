import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailSuccessErrorComponent } from './verify-email-success-error.component';

describe('VerifyEmailSuccessErrorComponent', () => {
  let component: VerifyEmailSuccessErrorComponent;
  let fixture: ComponentFixture<VerifyEmailSuccessErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ VerifyEmailSuccessErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyEmailSuccessErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
