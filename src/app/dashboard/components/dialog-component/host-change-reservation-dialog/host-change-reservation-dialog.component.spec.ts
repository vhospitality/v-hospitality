import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostChangeReservationDialogComponent } from './host-change-reservation-dialog.component';

describe('HostChangeReservationDialogComponent', () => {
  let component: HostChangeReservationDialogComponent;
  let fixture: ComponentFixture<HostChangeReservationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HostChangeReservationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostChangeReservationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
