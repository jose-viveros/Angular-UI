import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStudComponent } from './my-stud.component';

describe('MyStudComponent', () => {
  let component: MyStudComponent;
  let fixture: ComponentFixture<MyStudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyStudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyStudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
