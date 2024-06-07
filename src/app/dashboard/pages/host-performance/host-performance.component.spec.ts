import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPerformanceComponent } from './host-performance.component';

describe('HostPerformanceComponent', () => {
  let component: HostPerformanceComponent;
  let fixture: ComponentFixture<HostPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HostPerformanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
