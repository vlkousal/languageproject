import {Component, EventEmitter, Output} from '@angular/core';
import {GameComponent} from "../game-component/game.component";
import {Mode} from "../constants";

@Component({
  selector: 'app-draw-characters',
  templateUrl: './draw-characters.component.html',
  styleUrls: ['./draw-characters.component.css']
})
export class DrawCharactersComponent extends GameComponent {

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();

    constructor() {
        super(Mode.DrawCharacters);
    }
}
