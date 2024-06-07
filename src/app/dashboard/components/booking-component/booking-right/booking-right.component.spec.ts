import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRightComponent } from './booking-right.component';

describe('BookingRightComponent', () => {
  let component: BookingRightComponent;
  let fixture: ComponentFixture<BookingRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BookingRightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
