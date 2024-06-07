import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingLeftComponent } from './booking-left.component';

describe('BookingLeftComponent', () => {
  let component: BookingLeftComponent;
  let fixture: ComponentFixture<BookingLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BookingLeftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
