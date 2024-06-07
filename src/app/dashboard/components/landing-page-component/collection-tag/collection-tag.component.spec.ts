import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTagComponent } from './collection-tag.component';

describe('CollectionTagComponent', () => {
  let component: CollectionTagComponent;
  let fixture: ComponentFixture<CollectionTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CollectionTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
