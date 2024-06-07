import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationListingComponent } from './accommodation-listing.component';

describe('AccommodationListingComponent', () => {
  let component: AccommodationListingComponent;
  let fixture: ComponentFixture<AccommodationListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccommodationListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccommodationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
