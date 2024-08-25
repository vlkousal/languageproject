import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BACKEND, MAX_HEALTH, Mode, STREAK_FOR_HEALTH, Word} from "../constants";
import {SpeechUtils} from "../speechutils";
import {Utils} from "../utils";
import {GameSettingsComponent} from "../game-settings/game-settings.component";
import {VocabUtils} from "../vocabutils";
import {ApiTools} from "../api-tools";
import {GameComponent} from "../game-component/game.component";

@Component({
    selector: 'app-one-of-three',
    templateUrl: './one-of-three.component.html',
    styleUrls: ['./one-of-three.component.css'],
})
export class OneOfThreeComponent extends GameComponent {

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    @Output() settingsEmitter: EventEmitter<void> = new EventEmitter();
    buttonColors: string[] = ["#F9F8EB", "#F9F8EB", "#F9F8EB"];
    allowAnswering: boolean = true;

    constructor() {
        super(Mode.OneOfThree)
    }

    checkAnswer(answerIndex: number): void {
        if(!this.allowAnswering) return;

        const currentWord: Word = this.words[this.index];
        let isCorrect: boolean = currentWord.answers[answerIndex] == currentWord.correct;
        this.sendResult(isCorrect);
        if(isCorrect) {
            this.evalCorrect();
        } else{
            this.evalWrong();
            this.buttonColors[answerIndex] = "#e8a9a9";
            let correctIndex = currentWord.answers.indexOf(currentWord.correct);
            this.buttonColors[correctIndex] = "#9ff19f";
            SpeechUtils.speak(currentWord.correct, !this.isFlipped);
            this.allowAnswering = false;
            setTimeout(() => {
                this.buttonColors[answerIndex] = "#F9F8EB";
                this.buttonColors[correctIndex] = "#F9F8EB";
                this.allowAnswering = true;
            }, 200); // back to 2000 after debug
        }

        if(this.lives == 0 || this.index == this.words.length - 1) {
            this.hideEnd = false;
            if(!this.repeatingWrong) {
                this.sendVocabSetResult();
            }
            return;
        }
        this.index++;
        this.setNewWord();
    }

    sendVocabSetResult(): void {
        const data = {
            token: localStorage.getItem("sessionId"),
            setUrl: this.url,
            score: this.score
        }

        fetch(`${BACKEND}api/sendvocabresult/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
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
