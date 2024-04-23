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
        this.current = this.words[(++this.currentIndex) % this.words.length];
        SpeechUtils.speak(this.current.question);
    }

    prevFlashcard() {
        this.current = this.words[(--this.currentIndex) % this.words.length];
        SpeechUtils.speak(this.current.question);
    }
}
