import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingAreaComponent } from './testing-area.component';

describe('TestingAreaComponent', () => {
  let component: TestingAreaComponent;
  let fixture: ComponentFixture<TestingAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestingAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
