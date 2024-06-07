import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLeftSidenavListComponent } from './admin-left-sidenav-list.component';

describe('AdminLeftSidenavComponent', () => {
  let component: AdminLeftSidenavListComponent;
  let fixture: ComponentFixture<AdminLeftSidenavListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLeftSidenavListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLeftSidenavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
