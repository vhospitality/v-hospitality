import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclineReservationDialogComponent } from './decline-reservation-dialog.component';

describe('DeclineReservationDialogComponent', () => {
  let component: DeclineReservationDialogComponent;
  let fixture: ComponentFixture<DeclineReservationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DeclineReservationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclineReservationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
