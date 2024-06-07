import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingSummaryPreviewComponent } from './listing-summary-preview.component';

describe('ListingSummaryPreviewComponent', () => {
  let component: ListingSummaryPreviewComponent;
  let fixture: ComponentFixture<ListingSummaryPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ListingSummaryPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingSummaryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
