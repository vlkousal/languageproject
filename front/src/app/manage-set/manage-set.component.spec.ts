import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSetComponent } from './manage-set.component';

describe('ManageSetComponent', () => {
  let component: ManageSetComponent;
  let fixture: ComponentFixture<ManageSetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageSetComponent]
    });
    fixture = TestBed.createComponent(ManageSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
