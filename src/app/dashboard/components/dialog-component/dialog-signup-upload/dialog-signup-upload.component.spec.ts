import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSignupUploadComponent } from './dialog-signup-upload.component';

describe('DialogSignupUploadComponent', () => {
  let component: DialogSignupUploadComponent;
  let fixture: ComponentFixture<DialogSignupUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogSignupUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSignupUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
