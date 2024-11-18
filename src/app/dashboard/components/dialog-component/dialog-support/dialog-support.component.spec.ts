import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogSupportComponent } from "./dialog-support.component";

describe("DialogLoginComponent", () => {
  let component: DialogSupportComponent;
  let fixture: ComponentFixture<DialogSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSupportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
