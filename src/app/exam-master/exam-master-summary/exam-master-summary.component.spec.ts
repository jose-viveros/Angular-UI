import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamMasterSummaryComponent } from './exam-master-summary.component';

describe('ExamMasterSummaryComponent', () => {
  let component: ExamMasterSummaryComponent;
  let fixture: ComponentFixture<ExamMasterSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamMasterSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamMasterSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
