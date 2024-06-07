import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowGuestBookComponent } from './how-guest-book.component';

describe('HowGuestBookComponent', () => {
  let component: HowGuestBookComponent;
  let fixture: ComponentFixture<HowGuestBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HowGuestBookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowGuestBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
