import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPropertyBackgroundComponent } from './list-property-background.component';

describe('ListPropertyBackgroundComponent', () => {
  let component: ListPropertyBackgroundComponent;
  let fixture: ComponentFixture<ListPropertyBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ListPropertyBackgroundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPropertyBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
