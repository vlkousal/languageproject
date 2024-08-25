import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BACKEND, MAX_HEALTH, Mode, STREAK_FOR_HEALTH, Word} from "../constants";
import {SpeechUtils} from "../speechutils";
import {Utils} from "../utils";
import {GameSettingsComponent} from "../game-settings/game-settings.component";
import {VocabUtils} from "../vocabutils";
import {ApiTools} from "../api-tools";

@Component({
    selector: 'app-one-of-three',
    templateUrl: './one-of-three.component.html',
    styleUrls: ['./one-of-three.component.css'],
})
export class OneOfThreeComponent {

    @Input() words: Word[] = [];
    @Input() url: string = "";
    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    @Output() settingsEmitter: EventEmitter<void> = new EventEmitter();
    wordsCopy: Word[] = [];
    wrong: Word[] = [];
    index: number = 0;
    streak: number = 0;
    lives: number = 3;
    score: number = 0;
    correctAnswers: number = 0;
    hideEnd: boolean = true;
    showSettings: boolean = false;
    isFlipped: boolean = false;
    highScore: number = -1;
    buttonColors: string[] = ["#F9F8EB", "#F9F8EB", "#F9F8EB"];
    allowAnswering: boolean = true;
    repeatingWrong: boolean = false;

    async ngOnInit() {
        Utils.shuffleList(this.words);
        VocabUtils.sortByScore(this.words, Mode.OneOfThree);
        this.setNewWord();
        this.wordsCopy = [...this.words];

        this.highScore = await ApiTools.getHighScore(this.url, Mode.OneOfThree);
        console.log(this.highScore);
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
        const unflippedWord: Word | undefined = this.wordsCopy.find(w => w.id == this.words[this.index].id);
        if(unflippedWord !== undefined) this.wrong.push(unflippedWord);
    }

    setNewWord(): void {
        const currentWord: Word = this.words[this.index];
        // throw a coin to decide whether the languages get flipped
        const coinFlip: number = Utils.flipACoin();
        if(coinFlip == 1) {
            this.isFlipped = true;
            this.words[this.index] = new Word(currentWord.id, currentWord.score, currentWord.correct,
                currentWord.phonetic, currentWord.question, currentWord.flippedAnswers, currentWord.answers);
            SpeechUtils.speak(this.words[this.index].question, true);
            return;
        }
        this.isFlipped = false;
        SpeechUtils.speak(currentWord.question, false);
    }

    replayAll(): void {
        this.words = [...this.wordsCopy];
        this.resetStats();
    }

    replayWrong() : void {
        this.words = [];
        this.wrong.forEach((word) => {
            const found: Word | undefined = this.wordsCopy.find((w) => w.id == word.id);
            if(found !== undefined) {
                const typed: Word = found;
                this.words.push(typed);
            }
        })
        this.resetStats();
        this.repeatingWrong = true;
    }

    resetStats(): void {
        Utils.shuffleList(this.words);
        this.hideEnd = true;
        this.index = 0;
        this.setNewWord();
        this.lives = 3;
        this.score = 0;
        this.streak = 0;
        this.wrong = [];
        this.correctAnswers = 0;
        this.repeatingWrong = false;
    }

    sendResult(correct: boolean): void {
        const data = {
            token: localStorage.getItem("sessionId"),
            wordId: this.words[this.index].id,
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
