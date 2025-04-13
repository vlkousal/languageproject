import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordInputComponent } from './word-input.component';

describe('SetWordsComponentComponent', () => {
  let component: WordInputComponent;
  let fixture: ComponentFixture<WordInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordInputComponent]
    });
    fixture = TestBed.createComponent(WordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
