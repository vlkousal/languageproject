import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Word} from "../constants";

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.css']
})
export class EndScreenComponent {

    @Input() score: number = 0;
    @Input() correct: number = 0;
    @Input() wordCount: number = 0;
    @Input() words: Word[] = [];
    @Input() wrong: Word[] = [];

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    @Output() onReplayAll: EventEmitter<void> = new EventEmitter();
    @Output() onReplayWrong: EventEmitter<void> = new EventEmitter();

    showSettings: boolean = false;
    showFlashcards: boolean = false;
    protected readonly Math = Math;
}
