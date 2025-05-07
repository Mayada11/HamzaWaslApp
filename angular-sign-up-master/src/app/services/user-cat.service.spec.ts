import { TestBed } from '@angular/core/testing';

import { UserCatService } from './user-cat.service';

describe('UserCatService', () => {
  let service: UserCatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
