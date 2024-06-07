import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeofGuestComponent } from './typeof-guest.component';

describe('TypeofGuestComponent', () => {
  let component: TypeofGuestComponent;
  let fixture: ComponentFixture<TypeofGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TypeofGuestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeofGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
