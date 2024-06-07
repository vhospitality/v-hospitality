import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationDetailFormComponent } from './accommodation-detail-form.component';

describe('AccommodationDetailFormComponent', () => {
  let component: AccommodationDetailFormComponent;
  let fixture: ComponentFixture<AccommodationDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccommodationDetailFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccommodationDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
