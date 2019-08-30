import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentMyAccountComponent } from './parent-my-account.component';

describe('ParentMyAccountComponent', () => {
  let component: ParentMyAccountComponent;
  let fixture: ComponentFixture<ParentMyAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentMyAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentMyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
