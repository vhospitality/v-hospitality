import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestStayComponent } from './guest-stay.component';

describe('GuestStayComponent', () => {
  let component: GuestStayComponent;
  let fixture: ComponentFixture<GuestStayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GuestStayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestStayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
