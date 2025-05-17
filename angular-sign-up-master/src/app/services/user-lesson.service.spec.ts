import { TestBed } from '@angular/core/testing';

import { UserLessonService } from './user-lesson.service';

describe('UserLessonService', () => {
  let service: UserLessonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLessonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
