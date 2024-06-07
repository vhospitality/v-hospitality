import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestHomesComponent } from './best-homes.component';

describe('BestHomesComponent', () => {
  let component: BestHomesComponent;
  let fixture: ComponentFixture<BestHomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BestHomesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestHomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
