import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBookingFormComponent } from './view-booking-form.component';

describe('ViewBookingFormComponent', () => {
  let component: ViewBookingFormComponent;
  let fixture: ComponentFixture<ViewBookingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ViewBookingFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBookingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
