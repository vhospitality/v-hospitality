import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDetailsDialogComponent } from './guest-details-dialog.component';

describe('GuestDetailsDialogComponent', () => {
  let component: GuestDetailsDialogComponent;
  let fixture: ComponentFixture<GuestDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GuestDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
