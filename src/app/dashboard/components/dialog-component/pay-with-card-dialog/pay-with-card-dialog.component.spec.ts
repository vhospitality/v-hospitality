import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayWithCardDialogComponent } from './pay-with-card-dialog.component';

describe('PayWithCardDialogComponent', () => {
  let component: PayWithCardDialogComponent;
  let fixture: ComponentFixture<PayWithCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PayWithCardDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayWithCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
