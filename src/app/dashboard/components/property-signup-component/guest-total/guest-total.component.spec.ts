import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestTotalComponent } from './guest-total.component';

describe('GuestTotalComponent', () => {
  let component: GuestTotalComponent;
  let fixture: ComponentFixture<GuestTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GuestTotalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
