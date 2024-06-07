import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutFooterComponent } from './about-footer.component';

describe('AboutFooterComponent', () => {
  let component: AboutFooterComponent;
  let fixture: ComponentFixture<AboutFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AboutFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
