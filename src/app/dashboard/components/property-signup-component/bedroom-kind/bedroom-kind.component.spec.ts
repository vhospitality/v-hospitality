import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedroomKindComponent } from './bedroom-kind.component';

describe('BedroomKindComponent', () => {
  let component: BedroomKindComponent;
  let fixture: ComponentFixture<BedroomKindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BedroomKindComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BedroomKindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
