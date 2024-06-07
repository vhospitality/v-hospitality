import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSignupConfirmComponent } from './dialog-signup-confirm.component';

describe('DialogSignupConfirmComponent', () => {
  let component: DialogSignupConfirmComponent;
  let fixture: ComponentFixture<DialogSignupConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogSignupConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSignupConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
