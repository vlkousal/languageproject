import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetWordsComponentComponent } from './set-words-component.component';

describe('SetWordsComponentComponent', () => {
  let component: SetWordsComponentComponent;
  let fixture: ComponentFixture<SetWordsComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetWordsComponentComponent]
    });
    fixture = TestBed.createComponent(SetWordsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
