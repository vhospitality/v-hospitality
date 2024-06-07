import { TestBed } from '@angular/core/testing';

import { ToggleNavService } from './toggle-nav.service';

describe('ToggleNavService', () => {
  let service: ToggleNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToggleNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
