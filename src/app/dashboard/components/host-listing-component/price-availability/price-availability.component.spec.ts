import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceAvailabilityComponent } from './price-availability.component';

describe('PriceAvailabilityComponent', () => {
  let component: PriceAvailabilityComponent;
  let fixture: ComponentFixture<PriceAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PriceAvailabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
