import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabTableComponent } from './vocab-table.component';

describe('VocabTableComponent', () => {
  let component: VocabTableComponent;
  let fixture: ComponentFixture<VocabTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VocabTableComponent]
    });
    fixture = TestBed.createComponent(VocabTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
