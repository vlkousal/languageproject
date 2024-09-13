import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SpeechUtils} from "../../speechutils";
import {Utils} from "../../utils";
import {Word} from "../../../word";

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.css']
})

export class FlashcardsComponent {

    @Input() words: Word[] = [];
    @Output() onGoBack: EventEmitter<void> = new EventEmitter();

    currentIndex: number = 0;
    isFlipped: boolean = false;
    showSettings: boolean = false;

    ngOnInit(): void {
        Utils.shuffleList(this.words);
        SpeechUtils.speak(this.words[this.currentIndex].question);
    }

    switchFlashcard(): void {
        this.flipBack();
        if(this.currentIndex < 0){
            this.currentIndex = this.words.length - 1;
        } else if(this.currentIndex >= this.words.length){
            this.currentIndex = 0;
        }
        SpeechUtils.speak(this.words[this.currentIndex].question);
        this.isFlipped = false;
    }

    flipBack(): void {
        this.isFlipped = false;
    }

    toggleFlip(): void {
        this.isFlipped = !this.isFlipped;
        if(this.isFlipped) {
            SpeechUtils.speak(this.words[this.currentIndex].correct, true);
        } else{
            SpeechUtils.speak(this.words[this.currentIndex].question);
        }
    }
}
