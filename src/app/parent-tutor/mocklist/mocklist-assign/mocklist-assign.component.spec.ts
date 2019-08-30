import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MocklistAssignComponent } from './mocklist-assign.component';

describe('MocklistAssignComponent', () => {
  let component: MocklistAssignComponent;
  let fixture: ComponentFixture<MocklistAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MocklistAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MocklistAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
