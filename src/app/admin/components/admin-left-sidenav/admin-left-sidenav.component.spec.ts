import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeftSidenavComponent } from './admin-left-sidenav.component';

describe('AdminLeftSidenavComponent', () => {
  let component: AdminLeftSidenavComponent;
  let fixture: ComponentFixture<AdminLeftSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLeftSidenavComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLeftSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
