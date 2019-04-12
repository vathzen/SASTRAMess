import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWisePage } from './item-wise.page';

describe('ItemWisePage', () => {
  let component: ItemWisePage;
  let fixture: ComponentFixture<ItemWisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemWisePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemWisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
