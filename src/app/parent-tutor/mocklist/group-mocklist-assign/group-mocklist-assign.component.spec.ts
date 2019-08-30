import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMocklistAssignComponent } from './group-mocklist-assign.component';

describe('GroupMocklistAssignComponent', () => {
  let component: GroupMocklistAssignComponent;
  let fixture: ComponentFixture<GroupMocklistAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMocklistAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMocklistAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
