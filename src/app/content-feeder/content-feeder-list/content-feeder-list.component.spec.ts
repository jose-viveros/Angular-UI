import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFeederListComponent } from './content-feeder-list.component';

describe('ContentFeederListComponent', () => {
  let component: ContentFeederListComponent;
  let fixture: ComponentFixture<ContentFeederListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFeederListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFeederListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
