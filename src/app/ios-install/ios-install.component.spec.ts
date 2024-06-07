import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IosInstallComponent } from './ios-install.component';

describe('IosInstallComponent', () => {
  let component: IosInstallComponent;
  let fixture: ComponentFixture<IosInstallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IosInstallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IosInstallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
