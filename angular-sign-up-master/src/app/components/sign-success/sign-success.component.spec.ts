import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignSuccessComponent } from './sign-success.component';

describe('SignSuccessComponent', () => {
  let component: SignSuccessComponent;
  let fixture: ComponentFixture<SignSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
