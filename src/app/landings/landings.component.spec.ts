import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingsComponent } from './landings.component';

describe('LandingsComponent', () => {
  let component: LandingsComponent;
  let fixture: ComponentFixture<LandingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
