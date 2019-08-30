import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMyActivityComponent } from './student-my-activity.component';

describe('StudentMyActivityComponent', () => {
  let component: StudentMyActivityComponent;
  let fixture: ComponentFixture<StudentMyActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentMyActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMyActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
