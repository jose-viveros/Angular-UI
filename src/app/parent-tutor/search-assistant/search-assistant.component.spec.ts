import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAssistantComponent } from './search-assistant.component';

describe('SearchAssistantComponent', () => {
  let component: SearchAssistantComponent;
  let fixture: ComponentFixture<SearchAssistantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAssistantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
