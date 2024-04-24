import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOfThreeComponent } from './one-of-three.component';

describe('OneofthreeComponent', () => {
  let component: OneOfThreeComponent;
  let fixture: ComponentFixture<OneOfThreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneOfThreeComponent]
    });
    fixture = TestBed.createComponent(OneOfThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
