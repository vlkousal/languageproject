import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Word} from "../constants";
import {SpeechUtils} from "../speechutils";
import {Utils} from "../utils";

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.css']
})

export class FlashcardsComponent {

    @Input() words: Word[] = [];
    @Output() backEmitter: EventEmitter<void> = new EventEmitter();
    currentIndex: number = 0;
    current: Word = this.words[0];

    ngOnInit(): void {
        Utils.shuffleList(this.words);
        this.current = this.words[0];
        SpeechUtils.speak(this.current.question);
    }

    nextFlashcard(): void {
        this.currentIndex = (++this.currentIndex) % this.words.length;
        if(this.currentIndex >= this.words.length) {
            this.currentIndex = 0;
        }
        this.current = this.words[this.currentIndex];
        SpeechUtils.speak(this.current.question);
    }

    prevFlashcard(): void {
        this.currentIndex = (--this.currentIndex) % this.words.length
        if(this.currentIndex < 0) {
            this.currentIndex = this.words.length - 1;
        }
        this.current = this.words[this.currentIndex];
        SpeechUtils.speak(this.current.question);
    }
}
