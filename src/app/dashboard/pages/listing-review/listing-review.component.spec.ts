import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingReviewComponent } from './listing-review.component';

describe('ListingReviewComponent', () => {
  let component: ListingReviewComponent;
  let fixture: ComponentFixture<ListingReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ListingReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
