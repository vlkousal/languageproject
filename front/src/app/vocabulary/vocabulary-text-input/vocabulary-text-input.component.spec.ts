import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyTextInputComponent } from './vocabulary-text-input.component';

describe('VocabularyTextInputComponent', () => {
  let component: VocabularyTextInputComponent;
  let fixture: ComponentFixture<VocabularyTextInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VocabularyTextInputComponent]
    });
    fixture = TestBed.createComponent(VocabularyTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
