import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFeederDashboardComponent } from './content-feeder-dashboard.component';

describe('ContentFeederDashboardComponent', () => {
  let component: ContentFeederDashboardComponent;
  let fixture: ComponentFixture<ContentFeederDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFeederDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFeederDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
