import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyRulesComponent } from './policy-rules.component';

describe('PolicyRulesComponent', () => {
  let component: PolicyRulesComponent;
  let fixture: ComponentFixture<PolicyRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PolicyRulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
