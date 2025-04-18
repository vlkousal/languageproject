import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Mode} from "../../constants";
import {GameComponent} from "../game-component/game.component";
import {Word} from "../../../word";
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
        const answer: string = this.writtenAnswer.value;
        const currentWord: Word = this.words[this.index];
        const isCorrect: boolean = currentWord.correct == answer;
        this.sendResult(isCorrect);
        if(isCorrect) {
            this.evalCorrect();
        } else{
            this.evalWrong();
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

    protected readonly localStorage = localStorage;
}
