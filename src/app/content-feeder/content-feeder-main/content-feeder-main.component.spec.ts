import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFeederMainComponent } from './content-feeder-main.component';

describe('ContentFeederMainComponent', () => {
  let component: ContentFeederMainComponent;
  let fixture: ComponentFixture<ContentFeederMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFeederMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFeederMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
