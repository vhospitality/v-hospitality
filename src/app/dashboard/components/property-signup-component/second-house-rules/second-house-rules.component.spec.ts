import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondHouseRulesComponent } from './second-house-rules.component';

describe('SecondHouseRulesComponent', () => {
  let component: SecondHouseRulesComponent;
  let fixture: ComponentFixture<SecondHouseRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SecondHouseRulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondHouseRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
