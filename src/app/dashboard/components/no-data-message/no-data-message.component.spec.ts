import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataMessageComponent } from './no-data-message.component';

describe('NoDataMessageComponent', () => {
  let component: NoDataMessageComponent;
  let fixture: ComponentFixture<NoDataMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NoDataMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoDataMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
