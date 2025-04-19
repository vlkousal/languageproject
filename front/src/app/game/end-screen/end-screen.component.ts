import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Word} from "../../../Word";

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.css']
})
export class EndScreenComponent {

    @Input() score: number = 0;
    @Input() correctCount: number = 0;
    @Input() words: Word[] = [];
    @Input() wrong: Word[] = [];
    @Input() highScore: number = -1;

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    @Output() onReplayAll: EventEmitter<void> = new EventEmitter();
    @Output() onReplayWrong: EventEmitter<void> = new EventEmitter();

    showSettings: boolean = false;
    showFlashcards: boolean = false;

    protected readonly Math = Math;
}
