import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteUpExamListComponent } from './write-up-exam-list.component';

describe('WriteUpExamListComponent', () => {
  let component: WriteUpExamListComponent;
  let fixture: ComponentFixture<WriteUpExamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteUpExamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteUpExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
