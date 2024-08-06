import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BACKEND, MAX_HEALTH, STREAK_FOR_HEALTH, Word} from "../constants";
import {SpeechUtils} from "../speechutils";
import {Utils} from "../utils";
import {ApiTools} from "../apitools";

@Component({
    selector: 'app-oneofthree',
    templateUrl: './one-of-three.component.html',
    styleUrls: ['./one-of-three.component.css'],
})
export class OneOfThreeComponent {

    @Input() words: Word[] = [];
    @Output() gameOver: EventEmitter<void> = new EventEmitter();
    wrong: Word[] = [];
    index: number = 0;
    current: Word = this.words[0];
    streak: number = 0;
    lives: number = 3;
    score: number = 0;
    feedback: string = "";
    correctAnswers: number = 0;
    hideEnd: boolean = true;
    showSettings: boolean = false;

    ngOnInit() {
        Utils.shuffleList(this.words);
        this.current = this.words[0];
        SpeechUtils.checkMute();
        SpeechUtils.speak(this.current.question);
        console.log(SpeechUtils.isMuted);
    }

    checkAnswer(answer: string): void {
        if(this.current.correct == answer) {
            this.evalCorrect();
        } else {
            this.evalWrong();
        }
        this.setNewWord();
    }

    evalCorrect(): void {
        this.streak++;
        if(this.streak % STREAK_FOR_HEALTH == 0 && this.lives < MAX_HEALTH) {
            this.lives++;
        }
        this.score += this.streak;
        this.correctAnswers++;
        this.sendResult(true);
        this.feedback = "Correct!";
    }

    evalWrong(): void {
        this.streak = 0;
        this.lives--;
        this.wrong.push(this.current);
        if(this.lives == 0) {
            this.hideEnd = false;
            return;
        }
        this.sendResult(false);
        this.feedback = "The correct answer was " + this.current.correct;
    }

    setNewWord() {
        this.index++;
        if(this.index == this.words.length) {
            this.hideEnd = false;
            return;
        }
        this.current = this.words[this.index];

        // TODO - make "flipped" words and make speaking in both languages functional
        const firstLanguage: string | null = localStorage.getItem("firstLanguage");
        if(firstLanguage != null) {
            SpeechUtils.speak(this.current.question);
        }
    }

    replay() {
        Utils.shuffleList(this.words);
        this.current = this.words[0];
        this.lives = 3;
        this.score = 0;
        this.streak = 0;
        this.hideEnd = true;
    }

    goBack() {
        this.gameOver.emit();
    }

    sendResult(correct: boolean) {
        const data = {
            "token": localStorage.getItem("sessionId"),
            "wordId": this.current.id,
            "correct": correct
        }

        fetch(BACKEND + "api/addresult/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
    }

    speakQuestion(): void {
        const firstLanguage: string | null = localStorage.getItem("firstLanguage");
        if(firstLanguage != null) {
            SpeechUtils.speak(this.current.question);
        }
    }

    protected readonly Math = Math;
    protected readonly SpeechUtils = SpeechUtils;
}
