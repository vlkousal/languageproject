import {Component, Input} from '@angular/core';
import {Word} from "../constants";
import {SpeechUtils} from "../speechutils";

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.css']
})

export class FlashcardsComponent {

    currentIndex: number = 0;
    @Input() words: Word[] = [];
    current: Word = new Word(1, 1, "", "", "", []);

    ngOnInit() {
        this.current = this.words[0];
    }

    nextFlashcard() {
        this.currentIndex = (++this.currentIndex) % this.words.length;
        if(this.currentIndex >= this.words.length) {
            this.currentIndex = 0;
        }
        this.current = this.words[this.currentIndex];
        SpeechUtils.speak(this.current.question);
    }

    prevFlashcard() {
        this.currentIndex = (--this.currentIndex) % this.words.length
        if(this.currentIndex < 0) {
            this.currentIndex = this.words.length - 1;
        }
        this.current = this.words[this.currentIndex];
        SpeechUtils.speak(this.current.question);
    }
}
