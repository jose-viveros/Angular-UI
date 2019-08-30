import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDashboardComponent } from './individual-dashboard.component';

describe('IndividualDashboardComponent', () => {
  let component: IndividualDashboardComponent;
  let fixture: ComponentFixture<IndividualDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
