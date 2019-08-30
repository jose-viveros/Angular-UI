import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamExamFilterComponent } from './exam-filter.component';

describe('FilterComponent', () => {
  let component: ExamExamFilterComponent;
  let fixture: ComponentFixture<ExamExamFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamExamFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamExamFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
