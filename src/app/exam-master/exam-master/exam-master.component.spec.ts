import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamMasterComponent } from './exam-master.component';

describe('ExamMasterComponent', () => {
  let component: ExamMasterComponent;
  let fixture: ComponentFixture<ExamMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
