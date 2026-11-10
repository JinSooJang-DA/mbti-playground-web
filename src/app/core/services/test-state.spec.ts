import { TestBed } from '@angular/core/testing';

import { TestState } from './test-state';

describe('TestState', () => {
  let service: TestState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
