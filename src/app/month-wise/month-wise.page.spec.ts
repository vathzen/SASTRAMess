import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWisePage } from './month-wise.page';

describe('MonthWisePage', () => {
  let component: MonthWisePage;
  let fixture: ComponentFixture<MonthWisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthWisePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthWisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
