import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Word} from "../constants";

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.css']
})
export class EndScreenComponent {

    @Input() score: number = 0;
    @Input() words: Word[] = [];
    @Input() wrong: Word[] = [];

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    @Output() onReplayAll: EventEmitter<void> = new EventEmitter();
    @Output() onReplayWrong: EventEmitter<void> = new EventEmitter();

    showSettings: boolean = false;
    showFlashcards: boolean = false;
    correctCount: number = 0;

    ngOnInit(): void {
        this.correctCount = this.words.length - this.wrong.length;
    }

    protected readonly Math = Math;
}
