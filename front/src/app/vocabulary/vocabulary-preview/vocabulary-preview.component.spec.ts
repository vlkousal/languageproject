import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyPreviewComponent } from './vocabulary-preview.component';

describe('VocabularyPreviewComponent', () => {
  let component: VocabularyPreviewComponent;
  let fixture: ComponentFixture<VocabularyPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VocabularyPreviewComponent]
    });
    fixture = TestBed.createComponent(VocabularyPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
