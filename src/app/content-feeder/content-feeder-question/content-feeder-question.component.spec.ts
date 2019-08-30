import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFeederQuestionComponent } from './content-feeder-question.component';

describe('ContentFeederQuestionComponent', () => {
  let component: ContentFeederQuestionComponent;
  let fixture: ComponentFixture<ContentFeederQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFeederQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFeederQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
