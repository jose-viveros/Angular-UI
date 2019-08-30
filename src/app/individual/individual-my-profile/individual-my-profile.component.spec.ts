import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualMyProfileComponent } from './individual-my-profile.component';

describe('IndividualMyProfileComponent', () => {
  let component: IndividualMyProfileComponent;
  let fixture: ComponentFixture<IndividualMyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualMyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
