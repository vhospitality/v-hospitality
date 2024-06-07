import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostListPropertyComponent } from './host-list-property.component';

describe('HostListPropertyComponent', () => {
  let component: HostListPropertyComponent;
  let fixture: ComponentFixture<HostListPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HostListPropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostListPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
