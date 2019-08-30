import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentHelpComponent } from './parent-help.component';

describe('ParentHelpComponent', () => {
  let component: ParentHelpComponent;
  let fixture: ComponentFixture<ParentHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
