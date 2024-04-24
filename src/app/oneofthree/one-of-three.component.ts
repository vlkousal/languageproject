import {Component, Input} from '@angular/core';
import {BACKEND, MAX_HEALTH, STREAK_FOR_HEALTH, Word} from "../constants";
import {SpeechUtils} from "../speechutils";
import {Utils} from "../utils";

@Component({
  selector: 'app-oneofthree',
  templateUrl: './one-of-three.component.html',
  styleUrls: ['./one-of-three.component.css']
})

export class OneOfThreeComponent {

    @Input() words: Word[] = [];
    wrong: Word[] = [];
    index: number = 0;
    current: Word = new Word(1, 1, "", "", "", []);
    streak: number = 0;
    lives: number = 3;
    score: number = 0;
    feedback: string = "";
    correctAnswers: number = 0;
    hideEnd: boolean = true;

    ngOnInit() {
        this.current = this.words[0];
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
        console.log(this.lives);
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
        SpeechUtils.speak(this.current.question);
    }

    repeatWord() {
        SpeechUtils.speak(this.current.question);
    }

    replay() {
        Utils.shuffleList(this.words);
        this.current = this.words[0];
        this.lives = 3;
        this.score = 0;
        this.streak = 0;
        this.hideEnd = true;
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

    protected readonly Math = Math;
    protected readonly SpeechUtils = SpeechUtils;
}
