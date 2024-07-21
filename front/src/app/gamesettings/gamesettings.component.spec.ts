import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesettingsComponent } from './gamesettings.component';

describe('GamesettingsComponent', () => {
  let component: GamesettingsComponent;
  let fixture: ComponentFixture<GamesettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GamesettingsComponent]
    });
    fixture = TestBed.createComponent(GamesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
