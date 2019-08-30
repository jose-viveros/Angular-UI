import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumLinkComponent } from './breadcrum-link.component';

describe('BreadcrumLinkComponent', () => {
  let component: BreadcrumLinkComponent;
  let fixture: ComponentFixture<BreadcrumLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreadcrumLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
