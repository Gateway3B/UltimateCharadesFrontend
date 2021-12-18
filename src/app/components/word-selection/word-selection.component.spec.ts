import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSelectionComponent } from './word-selection.component';

describe('WordSelectionComponent', () => {
  let component: WordSelectionComponent;
  let fixture: ComponentFixture<WordSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
