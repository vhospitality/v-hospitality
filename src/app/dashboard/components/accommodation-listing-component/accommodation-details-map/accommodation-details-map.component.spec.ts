import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationDetailsMapComponent } from './accommodation-details-map.component';

describe('AccommodationDetailsMapComponent', () => {
  let component: AccommodationDetailsMapComponent;
  let fixture: ComponentFixture<AccommodationDetailsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccommodationDetailsMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccommodationDetailsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
