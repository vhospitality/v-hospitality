import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclineBookingComponent } from './decline-booking.component';

describe('DeclineBookingComponent', () => {
  let component: DeclineBookingComponent;
  let fixture: ComponentFixture<DeclineBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DeclineBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclineBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
