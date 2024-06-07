import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostReviewFeedbackComponent } from './host-review-feedback.component';

describe('HostReviewFeedbackComponent', () => {
  let component: HostReviewFeedbackComponent;
  let fixture: ComponentFixture<HostReviewFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HostReviewFeedbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostReviewFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
