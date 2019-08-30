import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudActivityComponent } from './stud-activity.component';

describe('StudActivityComponent', () => {
  let component: StudActivityComponent;
  let fixture: ComponentFixture<StudActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
