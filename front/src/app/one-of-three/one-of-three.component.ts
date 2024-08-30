import {Component, EventEmitter, Output} from '@angular/core';
import {BACKEND, Mode, Word} from "../constants";
import {SpeechUtils} from "../speechutils";
import {GameSettingsComponent} from "../game-settings/game-settings.component";
import {GameComponent} from "../game-component/game.component";

@Component({
    selector: 'app-one-of-three',
    templateUrl: './one-of-three.component.html',
    styleUrls: ['./one-of-three.component.css'],
})
export class OneOfThreeComponent extends GameComponent {

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    buttonColors: string[] = ["#F9F8EB", "#F9F8EB", "#F9F8EB"];
    allowAnswering: boolean = true;

    constructor() {
        super(Mode.OneOfThree)
    }

    checkAnswer(answerIndex: number): void {
        if(!this.allowAnswering) return;

        const currentWord: Word = this.words[this.index];
        const isCorrect: boolean = currentWord.answers[answerIndex] == currentWord.correct;
        this.sendResult(isCorrect);
        if(isCorrect) {
            this.evalCorrect();
        } else{
            this.evalWrong();
            this.buttonColors[answerIndex] = "#fd7676";
            let correctIndex = currentWord.answers.indexOf(currentWord.correct);
            this.buttonColors[correctIndex] = "#59bd59";
            SpeechUtils.speak(currentWord.correct, !this.isFlipped);
            this.allowAnswering = false;
            setTimeout(() => {
                this.buttonColors[answerIndex] = "#F9F8EB";
                this.buttonColors[correctIndex] = "#F9F8EB";
                this.allowAnswering = true;
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
        const firstLanguage: string | null = localStorage.getItem("firstLanguage");
        if(firstLanguage != null) {
            SpeechUtils.speak(this.words[this.index].question, this.isFlipped);
        }
    }

    protected readonly Math = Math;
    protected readonly SpeechUtils = SpeechUtils;
    protected readonly GameSettingsComponent = GameSettingsComponent;
    protected readonly localStorage = localStorage;
    protected readonly console = console;
    protected readonly Mode = Mode;
}
