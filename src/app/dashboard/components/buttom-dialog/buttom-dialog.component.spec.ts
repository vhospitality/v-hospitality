import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtomDialogComponent } from './buttom-dialog.component';

describe('ButtomDialogComponent', () => {
  let component: ButtomDialogComponent;
  let fixture: ComponentFixture<ButtomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ButtomDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
