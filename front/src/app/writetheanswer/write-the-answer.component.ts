import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SpeechUtils} from "../speechutils";
import {FormControl} from "@angular/forms";
import {MAX_HEALTH, STREAK_FOR_HEALTH, Word} from "../constants";
import {Utils} from "../utils";

@Component({
  selector: 'app-writetheanswer',
  templateUrl: './write-the-answer.component.html',
  styleUrls: ['./write-the-answer.component.css']
})

export class WriteTheAnswerComponent {

    @Input() words: Word[] = [];
    @Output() onGoBack: EventEmitter<void> = new EventEmitter();

    index: number = 0;
    current: Word = new Word(-1, [], "q", "p", "c", [], []);
    wrong: Word[] = [];
    writtenAnswer: FormControl<string> = new FormControl("") as FormControl<string>;
    score: number = 0;
    lives: number = 3;
    streak: number = 0;
    feedback: string = "";
    correctAnswers: number = 0;
    hideEnd: boolean = true;
    isFlipped: boolean = false;
    showSettings: boolean = false;

    ngOnInit() {
        Utils.shuffleList(this.words);
        this.current = this.words[0];
    }

    checkWrittenAnswer(): void{
        const answer: string = this.writtenAnswer.getRawValue();
        if(answer.length != 0) {
            if(this.current.correct == answer) {
                this.evalCorrect();
            } else{
                this.evalWrong();
            }
            this.setNewWord();
        }
        this.writtenAnswer.setValue("");
    }

    evalCorrect(): void {
        this.streak++;
        if(this.streak % STREAK_FOR_HEALTH == 0 && this.lives < MAX_HEALTH) {
            this.lives++;
        }
        this.score += this.streak;
        this.correctAnswers++;
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
        this.feedback = "The correct answer was " + this.current.correct;
    }

    setNewWord() {
        this.index++;
        if(this.index == this.words.length) {
            this.hideEnd = false;
            return;
        }
        this.current = this.words[this.index];
        //SpeechUtils.speak(this.current.question);
    }

    speakQuestion(): void {
        const firstLanguage: string | null = localStorage.getItem("firstLanguage");
        if(firstLanguage != null) {
            SpeechUtils.speak(this.words[this.index].question, this.isFlipped);
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

    protected readonly SpeechUtils = SpeechUtils;
    protected readonly Math = Math;
    protected readonly localStorage = localStorage;
}
