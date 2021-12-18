import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharadesComponent } from './charades.component';

describe('CharadesComponent', () => {
  let component: CharadesComponent;
  let fixture: ComponentFixture<CharadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
