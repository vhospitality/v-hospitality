import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppPublicSidenavListComponent } from './app-public-sidenav-list.component';

describe('AppPublicSidenavListComponent', () => {
  let component: AppPublicSidenavListComponent;
  let fixture: ComponentFixture<AppPublicSidenavListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppPublicSidenavListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPublicSidenavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
