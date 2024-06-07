import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfricanHospitalityComponent } from './african-hospitality.component';

describe('AfricanHospitalityComponent', () => {
  let component: AfricanHospitalityComponent;
  let fixture: ComponentFixture<AfricanHospitalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AfricanHospitalityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfricanHospitalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
