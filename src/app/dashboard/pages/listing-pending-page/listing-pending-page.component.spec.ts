import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingPendingPageComponent } from './listing-pending-page.component';

describe('ListingPendingPageComponent', () => {
  let component: ListingPendingPageComponent;
  let fixture: ComponentFixture<ListingPendingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ListingPendingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingPendingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
