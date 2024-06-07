import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordSetNewComponent } from './forgot-password-set-new.component';

describe('ForgotPasswordSetNewComponent', () => {
  let component: ForgotPasswordSetNewComponent;
  let fixture: ComponentFixture<ForgotPasswordSetNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ForgotPasswordSetNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordSetNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
