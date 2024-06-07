import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestCheckOutComponent } from './guest-check-out.component';

describe('GuestCheckOutComponent', () => {
  let component: GuestCheckOutComponent;
  let fixture: ComponentFixture<GuestCheckOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GuestCheckOutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestCheckOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
