import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorHelpComponent } from './tutor-help.component';

describe('TutorHelpComponent', () => {
  let component: TutorHelpComponent;
  let fixture: ComponentFixture<TutorHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
