import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSignupAffiliateComponent } from './dialog-signup-affiliate.component';

describe('DialogSignupAffiliateComponent', () => {
  let component: DialogSignupAffiliateComponent;
  let fixture: ComponentFixture<DialogSignupAffiliateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSignupAffiliateComponent]
    });
    fixture = TestBed.createComponent(DialogSignupAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
