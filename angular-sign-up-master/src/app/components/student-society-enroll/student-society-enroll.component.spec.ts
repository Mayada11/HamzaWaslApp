import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSocietyEnrollComponent } from './student-society-enroll.component';

describe('StudentSocietyEnrollComponent', () => {
  let component: StudentSocietyEnrollComponent;
  let fixture: ComponentFixture<StudentSocietyEnrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentSocietyEnrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSocietyEnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
