import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawCharactersComponent } from './draw-characters.component';

describe('DrawCharactersComponent', () => {
  let component: DrawCharactersComponent;
  let fixture: ComponentFixture<DrawCharactersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrawCharactersComponent]
    });
    fixture = TestBed.createComponent(DrawCharactersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
