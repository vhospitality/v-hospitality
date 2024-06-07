import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingSummaryFormComponent } from './listing-summary-form.component';

describe('ListingSummaryFormComponent', () => {
  let component: ListingSummaryFormComponent;
  let fixture: ComponentFixture<ListingSummaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ListingSummaryFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingSummaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
