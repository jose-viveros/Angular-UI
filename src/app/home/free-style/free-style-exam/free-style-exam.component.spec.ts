import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeStyleExamComponent } from './free-style-exam.component';

describe('FreeStyleExamComponent', () => {
  let component: FreeStyleExamComponent;
  let fixture: ComponentFixture<FreeStyleExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeStyleExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeStyleExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
