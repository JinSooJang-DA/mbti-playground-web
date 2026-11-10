import { TestBed } from '@angular/core/testing';

import { ScenarioData } from './scenario-data';

describe('ScenarioData', () => {
  let service: ScenarioData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScenarioData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
