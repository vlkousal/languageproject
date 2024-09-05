import {Component, EventEmitter, Output} from '@angular/core';
import {SpeechUtils} from "../speechutils";
import {FormControl} from "@angular/forms";
import {Mode} from "../constants";
import {GameComponent} from "../game-component/game.component";
import {Word} from "../../word";
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'app-writetheanswer',
  templateUrl: './write-the-answer.component.html',
  styleUrls: ['./write-the-answer.component.css']
})
export class WriteTheAnswerComponent extends GameComponent {

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    writtenAnswer: FormControl<string> = new FormControl("") as FormControl<string>;


    constructor(cookieService: CookieService) {
        super(Mode.WriteTheAnswer, cookieService);
    }

    checkAnswer(): void {
        const answer: string = this.writtenAnswer.getRawValue();
        const currentWord: Word = this.words[this.index];
        const isCorrect: boolean = currentWord.correct == answer;
        this.sendResult(isCorrect);
        if(isCorrect) {
            this.evalCorrect();
        } else{
            this.evalWrong();
            SpeechUtils.speak(currentWord.correct, !this.isFlipped);
        }
        this.writtenAnswer.setValue("");

        if(this.lives == 0 || this.index == this.words.length - 1) {
            this.showEnd = true;
            if(!this.repeatingWrong) {
                this.sendVocabSetResult();
            }
            return;
        }
        this.index++;
        this.setNewWord();
    }

    speakQuestion(): void {
        const firstLanguage: string | null = sessionStorage.getItem("firstLanguage");
        if(firstLanguage != null) {
            SpeechUtils.speak(this.words[this.index].question, this.isFlipped);
        }
    }

    protected readonly Math = Math;
    protected readonly localStorage = localStorage;
    protected readonly console = console;
}
