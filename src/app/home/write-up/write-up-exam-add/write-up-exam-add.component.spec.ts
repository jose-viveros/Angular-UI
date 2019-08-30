import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteUpExamAddComponent } from './write-up-exam-add.component';

describe('WriteUpExamAddComponent', () => {
  let component: WriteUpExamAddComponent;
  let fixture: ComponentFixture<WriteUpExamAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteUpExamAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteUpExamAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
