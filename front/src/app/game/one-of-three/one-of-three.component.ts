import {Component, EventEmitter, Output} from '@angular/core';
import {Mode} from "../../constants";
import {GameSettingsComponent} from "../game-settings/game-settings.component";
import {GameComponent} from "../game-component/game.component";
import {Word} from "../../../Word";
import {CookieService} from "ngx-cookie";

@Component({
    selector: 'app-one-of-three',
    templateUrl: './one-of-three.component.html',
    styleUrls: ['./one-of-three.component.css'],
})
export class OneOfThreeComponent extends GameComponent {

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    buttonColors: string[] = ["#F9F8EB", "#F9F8EB", "#F9F8EB"];
    allowAnswering: boolean = true;

    constructor(cookieService: CookieService) {
        super(Mode.OneOfThree, cookieService);
    }

    checkAnswer(answerIndex: number): void {
        if(!this.allowAnswering) return;

        const currentWord: Word = this.words[this.index];
        const isCorrect: boolean = currentWord.answers[answerIndex] == currentWord.correct;
        this.sendResult(isCorrect);
        if(isCorrect) {
            this.evalCorrect();
            this.index++;
            this.setNewWord();
        } else{
            this.evalWrong();
            this.buttonColors[answerIndex] = "#fd7676";
            const correctIndex = currentWord.answers.indexOf(currentWord.correct);
            this.buttonColors[correctIndex] = "#59bd59";
            this.allowAnswering = false;
            setTimeout(() => {
                this.buttonColors[answerIndex] = "#F9F8EB";
                this.buttonColors[correctIndex] = "#F9F8EB";
                this.allowAnswering = true;
                this.index++;
                this.setNewWord();
            }, 1500); // back to 2000 after debug
        }

        if(this.lives == 0 || this.index == this.words.length - 1) {
            this.showEnd = true;
            if(!this.repeatingWrong) {
                this.sendVocabSetResult();
            }
            return;
        }
    }

    speakQuestion(): void {
        const language: string | null = sessionStorage.getItem("language");
    }

    protected readonly GameSettingsComponent = GameSettingsComponent;
    protected readonly localStorage = localStorage;
    protected readonly Mode = Mode;
}
