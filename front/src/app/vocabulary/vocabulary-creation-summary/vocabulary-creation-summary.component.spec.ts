import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyCreationSummaryComponent } from './vocabulary-creation-summary.component';

describe('VocabularyCreationSummaryComponent', () => {
  let component: VocabularyCreationSummaryComponent;
  let fixture: ComponentFixture<VocabularyCreationSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VocabularyCreationSummaryComponent]
    });
    fixture = TestBed.createComponent(VocabularyCreationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
