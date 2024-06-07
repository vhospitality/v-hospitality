import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPublicSidenavComponent } from './app-public-sidenav.component';

describe('AppPublicSidenavComponent', () => {
  let component: AppPublicSidenavComponent;
  let fixture: ComponentFixture<AppPublicSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppPublicSidenavComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPublicSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
