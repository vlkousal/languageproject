import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySelectionComponent } from './category-selection.component';

describe('CategorySelectionComponent', () => {
  let component: CategorySelectionComponent;
  let fixture: ComponentFixture<CategorySelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorySelectionComponent]
    });
    fixture = TestBed.createComponent(CategorySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
