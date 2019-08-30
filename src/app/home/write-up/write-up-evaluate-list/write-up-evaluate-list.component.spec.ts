import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteUpEvaluateListComponent } from './write-up-evaluate-list.component';

describe('WriteUpEvaluateListComponent', () => {
  let component: WriteUpEvaluateListComponent;
  let fixture: ComponentFixture<WriteUpEvaluateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteUpEvaluateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteUpEvaluateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
