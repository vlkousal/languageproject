import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Utils} from "../../utils";
import {Word} from "../../../Word";

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
    }

    switchFlashcard(): void {
        this.flipBack();
        if(this.currentIndex < 0){
            this.currentIndex = this.words.length - 1;
        } else if(this.currentIndex >= this.words.length){
            this.currentIndex = 0;
        }
        this.isFlipped = false;
    }

    flipBack(): void {
        this.isFlipped = false;
    }

    toggleFlip(): void {
        this.isFlipped = !this.isFlipped;
    }
}
