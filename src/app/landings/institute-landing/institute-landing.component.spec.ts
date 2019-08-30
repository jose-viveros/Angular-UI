import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteLandingComponent } from './institute-landing.component';

describe('InstituteLandingComponent', () => {
  let component: InstituteLandingComponent;
  let fixture: ComponentFixture<InstituteLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituteLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituteLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
