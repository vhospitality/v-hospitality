import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSignupThankyouComponent } from './dialog-signup-thankyou.component';

describe('DialogSignupThankyouComponent', () => {
  let component: DialogSignupThankyouComponent;
  let fixture: ComponentFixture<DialogSignupThankyouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogSignupThankyouComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSignupThankyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
