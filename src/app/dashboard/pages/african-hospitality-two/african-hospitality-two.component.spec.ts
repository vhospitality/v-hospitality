import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfricanHospitalityTwoComponent } from './african-hospitality-two.component';

describe('AfricanHospitalityTwoComponent', () => {
  let component: AfricanHospitalityTwoComponent;
  let fixture: ComponentFixture<AfricanHospitalityTwoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfricanHospitalityTwoComponent]
    });
    fixture = TestBed.createComponent(AfricanHospitalityTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
