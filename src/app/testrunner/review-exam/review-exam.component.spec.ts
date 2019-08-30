import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewExamComponent } from './review-exam.component';

describe('ReviewExamComponent', () => {
  let component: ReviewExamComponent;
  let fixture: ComponentFixture<ReviewExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
