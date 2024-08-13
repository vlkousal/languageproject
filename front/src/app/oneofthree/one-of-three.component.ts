import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BACKEND, MAX_HEALTH, Mode, STREAK_FOR_HEALTH, Word} from "../constants";
import {SpeechUtils} from "../speechutils";
import {Utils} from "../utils";
import {GameSettingsComponent} from "../game-settings/game-settings.component";
import {VocabUtils} from "../vocabutils";

@Component({
    selector: 'app-oneofthree',
    templateUrl: './one-of-three.component.html',
    styleUrls: ['./one-of-three.component.css'],
})
export class OneOfThreeComponent {

    @Input() words: Word[] = [];
    @Input() url: string = "";
    @Output() gameOver: EventEmitter<void> = new EventEmitter();
    wrong: Word[] = [];
    index: number = 0;
    current: Word = this.words[0];
    streak: number = 0;
    lives: number = 3;
    score: number = 0;
    correctAnswers: number = 0;
    hideEnd: boolean = true;
    showSettings: boolean = false;
    isFlipped: boolean = false;

    buttonColors: string[] = ["#F9F8EB", "#F9F8EB", "#F9F8EB"];
    allowAnswering: boolean = true;

    ngOnInit() {
        Utils.shuffleList(this.words);
        VocabUtils.sortByScore(this.words, Mode.OneOfThree);
        console.log(this.words);
        this.setNewWord();
        SpeechUtils.checkMute();
    }

    checkAnswer(answerIndex: number): void {
        if(!this.allowAnswering) return;

        let isCorrect: boolean = this.current.answers[answerIndex] == this.current.correct;
        this.sendResult(isCorrect);
        if(isCorrect) {
            this.evalCorrect();
            this.setNewWord();
        } else{
            this.buttonColors[answerIndex] = "#e8a9a9";
            let correctIndex = this.current.answers.indexOf(this.current.correct);
            this.buttonColors[correctIndex] = "#9ff19f";
            SpeechUtils.speak(this.current.correct, !this.isFlipped);
            this.allowAnswering = false;
            this.isFlipped = false;
            setTimeout(() => {
                this.buttonColors[answerIndex] = "#F9F8EB";
                this.buttonColors[correctIndex] = "#F9F8EB";
                this.setNewWord();
                this.allowAnswering = true;
                this.evalWrong();
            }, 2000);
        }
    }

    evalCorrect(): void {
        this.streak++;
        if(this.streak % STREAK_FOR_HEALTH == 0 && this.lives < MAX_HEALTH) {
            this.lives++;
        }
        this.score += this.streak;
        this.correctAnswers++;
    }

    evalWrong(): void {
        this.streak = 0;
        this.lives--;
        this.wrong.push(this.current);
        if(this.lives == 0) {
            this.sendVocabSetResult();
            this.hideEnd = false;
            return;
        }
    }

    setNewWord(): void {
        if(this.index == this.words.length) {
            this.hideEnd = false;
            return;
        }

        this.current = this.words[this.index];
        // throw a coin to decide whether the languages get flipped
        const coinFlip: number = Utils.flipACoin();
        if(coinFlip == 1) {
            this.isFlipped = true;
            const temp = this.current.question;
            this.current.question = this.current.correct;
            this.current.correct = temp;
            this.current.answers = [...this.current.flippedAnswers];
            SpeechUtils.speak(this.current.question, true);
        } else{
            this.isFlipped = false;
            SpeechUtils.speak(this.current.question, false);
        }
        this.index++;
    }

    replay(): void {
        Utils.shuffleList(this.words);
        this.current = this.words[0];
        this.lives = 3;
        this.score = 0;
        this.streak = 0;
        this.hideEnd = true;
    }

    goBack(): void {
        this.gameOver.emit();
    }

    sendResult(correct: boolean): void {
        const data = {
            token: localStorage.getItem("sessionId"),
            wordId: this.current.id,
            mode: Mode.OneOfThree,
            correct: correct
        };

        fetch(`${BACKEND}api/addresult/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
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
            SpeechUtils.speak(this.current.question, this.isFlipped);
        }
    }

    protected readonly Math = Math;
    protected readonly SpeechUtils = SpeechUtils;
    protected readonly GameSettingsComponent = GameSettingsComponent;
    protected readonly localStorage = localStorage;
}
