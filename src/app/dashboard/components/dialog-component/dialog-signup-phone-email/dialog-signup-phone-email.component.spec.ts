import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSignupPhoneEmailComponent } from './dialog-signup-phone-email.component';

describe('DialogSignupPhoneEmailComponent', () => {
  let component: DialogSignupPhoneEmailComponent;
  let fixture: ComponentFixture<DialogSignupPhoneEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogSignupPhoneEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSignupPhoneEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
