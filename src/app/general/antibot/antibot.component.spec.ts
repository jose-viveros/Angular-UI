import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntibotComponent } from './antibot.component';

describe('AntibotComponent', () => {
  let component: AntibotComponent;
  let fixture: ComponentFixture<AntibotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntibotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntibotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
