import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOptionComponent } from './sign-option.component';

describe('SignOptionComponent', () => {
  let component: SignOptionComponent;
  let fixture: ComponentFixture<SignOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
