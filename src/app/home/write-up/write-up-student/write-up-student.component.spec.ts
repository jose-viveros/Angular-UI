import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteUpStudentComponent } from './write-up-student.component';

describe('WriteUpStudentComponent', () => {
  let component: WriteUpStudentComponent;
  let fixture: ComponentFixture<WriteUpStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteUpStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteUpStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
