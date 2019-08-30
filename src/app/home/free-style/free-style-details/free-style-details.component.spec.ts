import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeStyleDetailsComponent } from './free-style-details.component';

describe('FreeStyleDetailsComponent', () => {
  let component: FreeStyleDetailsComponent;
  let fixture: ComponentFixture<FreeStyleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeStyleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeStyleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
