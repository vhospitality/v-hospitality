import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSignupDetailsComponent } from './dialog-signup-details.component';

describe('DialogSignupDetailsComponent', () => {
  let component: DialogSignupDetailsComponent;
  let fixture: ComponentFixture<DialogSignupDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogSignupDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSignupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
