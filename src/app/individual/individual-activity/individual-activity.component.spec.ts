import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualActivityComponent } from './individual-activity.component';

describe('IndividualActivityComponent', () => {
  let component: IndividualActivityComponent;
  let fixture: ComponentFixture<IndividualActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
