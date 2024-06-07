import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatePayoutDialogComponent } from './initiate-payout-dialog.component';

describe('InitiatePayoutDialogComponent', () => {
  let component: InitiatePayoutDialogComponent;
  let fixture: ComponentFixture<InitiatePayoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InitiatePayoutDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitiatePayoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
