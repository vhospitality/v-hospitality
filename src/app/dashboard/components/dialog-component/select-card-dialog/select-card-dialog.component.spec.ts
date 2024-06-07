import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCardDialogComponent } from './select-card-dialog.component';

describe('SelectCardDialogComponent', () => {
  let component: SelectCardDialogComponent;
  let fixture: ComponentFixture<SelectCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SelectCardDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
