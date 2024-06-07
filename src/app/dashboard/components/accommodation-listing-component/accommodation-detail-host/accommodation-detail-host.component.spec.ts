import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationDetailHostComponent } from './accommodation-detail-host.component';

describe('AccommodationDetailHostComponent', () => {
  let component: AccommodationDetailHostComponent;
  let fixture: ComponentFixture<AccommodationDetailHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccommodationDetailHostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccommodationDetailHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
