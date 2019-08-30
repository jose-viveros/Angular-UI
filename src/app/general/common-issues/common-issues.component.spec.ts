import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonIssuesComponent } from './common-issues.component';

describe('CommonIssuesComponent', () => {
  let component: CommonIssuesComponent;
  let fixture: ComponentFixture<CommonIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
