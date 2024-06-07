import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyRegistrationPageComponent } from './property-registration-page.component';

describe('PropertyRegistrationPageComponent', () => {
  let component: PropertyRegistrationPageComponent;
  let fixture: ComponentFixture<PropertyRegistrationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PropertyRegistrationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyRegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
