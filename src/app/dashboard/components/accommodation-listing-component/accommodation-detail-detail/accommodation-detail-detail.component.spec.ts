import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationDetailDetailComponent } from './accommodation-detail-detail.component';

describe('AccommodationDetailDetailComponent', () => {
  let component: AccommodationDetailDetailComponent;
  let fixture: ComponentFixture<AccommodationDetailDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccommodationDetailDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccommodationDetailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
