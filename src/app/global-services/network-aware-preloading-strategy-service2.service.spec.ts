import { TestBed } from '@angular/core/testing';

import { NetworkAwarePreloadingStrategyService2Service } from './network-aware-preloading-strategy.service';

describe('NetworkAwarePreloadingStrategyService2Service', () => {
  let service: NetworkAwarePreloadingStrategyService2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkAwarePreloadingStrategyService2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
