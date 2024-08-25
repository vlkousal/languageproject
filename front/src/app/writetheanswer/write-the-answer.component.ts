import {Component, EventEmitter, Output} from '@angular/core';
import {SpeechUtils} from "../speechutils";
import {FormControl} from "@angular/forms";
import {Mode} from "../constants";
import {GameComponent} from "../game-component/game.component";

@Component({
  selector: 'app-writetheanswer',
  templateUrl: './write-the-answer.component.html',
  styleUrls: ['./write-the-answer.component.css']
})
export class WriteTheAnswerComponent extends GameComponent {

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    writtenAnswer: FormControl<string> = new FormControl("") as FormControl<string>;

    constructor() {
        super(Mode.WriteTheAnswer)
    }

    checkWrittenAnswer(): void{
        const answer: string = this.writtenAnswer.getRawValue();
        if(answer.length != 0) {
            if(this.words[this.index].correct == answer) {
                this.evalCorrect();
            } else{
                this.evalWrong();
            }
            this.setNewWord();
        }
        this.writtenAnswer.setValue("");
    }

    speakQuestion(): void {
        const firstLanguage: string | null = localStorage.getItem("firstLanguage");
        if(firstLanguage != null) {
            SpeechUtils.speak(this.words[this.index].question, this.isFlipped);
        }
    }

    protected readonly Math = Math;
    protected readonly localStorage = localStorage;
    protected readonly console = console;
}
