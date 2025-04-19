import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyFileUploadComponent } from './vocabulary-file-upload.component';

describe('VocabularyFileUploadComponent', () => {
  let component: VocabularyFileUploadComponent;
  let fixture: ComponentFixture<VocabularyFileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VocabularyFileUploadComponent]
    });
    fixture = TestBed.createComponent(VocabularyFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
