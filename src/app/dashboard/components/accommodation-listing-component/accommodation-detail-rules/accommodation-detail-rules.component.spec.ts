import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationDetailRulesComponent } from './accommodation-detail-rules.component';

describe('AccommodationDetailRulesComponent', () => {
  let component: AccommodationDetailRulesComponent;
  let fixture: ComponentFixture<AccommodationDetailRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccommodationDetailRulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccommodationDetailRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
