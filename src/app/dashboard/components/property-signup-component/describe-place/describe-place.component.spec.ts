import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescribePlaceComponent } from './describe-place.component';

describe('DescribePlaceComponent', () => {
  let component: DescribePlaceComponent;
  let fixture: ComponentFixture<DescribePlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DescribePlaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescribePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
