import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationListingMapComponent } from './accommodation-listing-map.component';

describe('AccommodationListingMapComponent', () => {
  let component: AccommodationListingMapComponent;
  let fixture: ComponentFixture<AccommodationListingMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccommodationListingMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccommodationListingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
