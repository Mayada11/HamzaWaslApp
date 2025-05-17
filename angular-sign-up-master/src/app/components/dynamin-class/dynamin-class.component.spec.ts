import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynaminClassComponent } from './dynamin-class.component';

describe('DynaminClassComponent', () => {
  let component: DynaminClassComponent;
  let fixture: ComponentFixture<DynaminClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynaminClassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynaminClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
