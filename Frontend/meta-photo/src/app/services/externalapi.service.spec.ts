import { TestBed } from '@angular/core/testing';

import { ExternalapiService } from './externalapi.service';

describe('ExternalapiService', () => {
  let service: ExternalapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
