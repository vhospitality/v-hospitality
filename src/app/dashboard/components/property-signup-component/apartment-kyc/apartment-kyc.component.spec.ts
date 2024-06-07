import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentKycComponent } from './apartment-kyc.component';

describe('ApartmentKycComponent', () => {
  let component: ApartmentKycComponent;
  let fixture: ComponentFixture<ApartmentKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ApartmentKycComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApartmentKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
