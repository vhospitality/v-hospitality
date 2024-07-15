import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleDateDialogComponent } from './toggle-date-dialog.component';

describe('ToggleDateDialogComponent', () => {
  let component: ToggleDateDialogComponent;
  let fixture: ComponentFixture<ToggleDateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleDateDialogComponent]
    });
    fixture = TestBed.createComponent(ToggleDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
