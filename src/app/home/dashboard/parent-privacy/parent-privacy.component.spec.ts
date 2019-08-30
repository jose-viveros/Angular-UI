import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentPrivacyComponent } from './parent-privacy.component';

describe('ParentPrivacyComponent', () => {
  let component: ParentPrivacyComponent;
  let fixture: ComponentFixture<ParentPrivacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentPrivacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
