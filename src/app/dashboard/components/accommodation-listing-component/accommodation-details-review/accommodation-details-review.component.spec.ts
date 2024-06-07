import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationDetailsReviewComponent } from './accommodation-details-review.component';

describe('AccommodationDetailsReviewComponent', () => {
  let component: AccommodationDetailsReviewComponent;
  let fixture: ComponentFixture<AccommodationDetailsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccommodationDetailsReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccommodationDetailsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
