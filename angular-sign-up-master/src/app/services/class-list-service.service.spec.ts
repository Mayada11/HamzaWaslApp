import { TestBed } from '@angular/core/testing';

import { ClassListServiceService } from './class-list-service.service';

describe('ClassListServiceService', () => {
  let service: ClassListServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassListServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
