import { TestBed } from '@angular/core/testing';

import { LinkgenService } from './linkgen.service';

describe('LinkgenService', () => {
  let service: LinkgenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkgenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
