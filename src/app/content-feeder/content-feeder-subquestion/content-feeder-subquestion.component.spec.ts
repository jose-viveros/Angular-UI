import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFeederSubquestionComponent } from './content-feeder-subquestion.component';

describe('ContentFeederSubquestionComponent', () => {
  let component: ContentFeederSubquestionComponent;
  let fixture: ComponentFixture<ContentFeederSubquestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFeederSubquestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFeederSubquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
