import {Component, Input, OnInit} from '@angular/core';
import {BACKEND, MAX_HEALTH, Mode, STREAK_FOR_HEALTH, Word} from "../constants";
import {Utils} from "../utils";
import {SpeechUtils} from "../speechutils";
import {VocabUtils} from "../vocabutils";
import {ApiTools} from "../api-tools";


@Component({
  selector: 'app-game-component',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

    showEnd: boolean = false;
    @Input() words: Word[] = [];
    @Input() url: string = "";
    wordsCopy: Word[] = [];
    wrong: Word[] = [];
    index: number = 0;
    isFlipped: boolean = false;
    streak: number = 0;
    lives: number = 3;
    score: number = 0;
    correctAnswers: number = 0;
    highScore: number = -1;
    repeatingWrong: boolean = false;
    showSettings: boolean = false;
    mode: Mode;

    constructor(mode: Mode) {
        this.mode = mode;
    }

    async ngOnInit(): Promise<void> {
        Utils.shuffleList(this.words);
        VocabUtils.sortByScore(this.words, this.mode);
        this.wordsCopy = [...this.words];
        this.highScore = await ApiTools.getHighScore(this.url, this.mode);
        if(this.mode == Mode.DrawCharacters) GameComponent.prepDrawingCanvas();
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

    replayAll(): void {
        this.words = [...this.wordsCopy];
        this.resetStats();
    }

    replayWrong(): void {
        this.words = [];
        this.wrong.forEach((word) => {
            const found: Word | undefined = this.wordsCopy.find((w) => w.id == word.id);
            if(found !== undefined) {
                this.words.push(found);
            }
        })
        this.resetStats();
        this.repeatingWrong = true;
    }

    resetStats(): void {
        Utils.shuffleList(this.words);
        this.showEnd = false;
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
            mode: this.mode,
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

    setNewWord(): void {
        console.log("word index", this.index);
        const currentWord: Word = this.words[this.index];

        // throw a coin to decide whether the languages get flipped
        const coinFlip: number = Utils.flipACoin();
        if(this.mode != Mode.DrawCharacters && coinFlip == 1) {
            this.isFlipped = true;
            this.words[this.index] = new Word(currentWord.id, currentWord.score, currentWord.correct,
                currentWord.phonetic, currentWord.question, currentWord.flippedAnswers, currentWord.answers);
            SpeechUtils.speak(this.words[this.index].question, true);
            return;
        }
        this.isFlipped = false;
        SpeechUtils.speak(currentWord.question, false);
        this.index++;
    }

    sendVocabSetResult(): void {
        const data = {
            token: localStorage.getItem("sessionId"),
            setUrl: this.url,
            score: this.score,
            mode: this.mode
        }

        fetch(`${BACKEND}api/sendvocabresult/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
    }

    static prepDrawingCanvas() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const testingCanvas = document.getElementById("testingCanvas") as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        const testingContext = testingCanvas.getContext('2d');

        if(context == null || testingContext == null) return;

        context.font = '200px Arial';
        testingContext.font = "200px Arial";

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        function startDrawing(e: { clientX: number; clientY: number; }) {
            isDrawing = true;
            lastX = e.clientX - canvas.getBoundingClientRect().left;
            lastY = e.clientY - canvas.getBoundingClientRect().top;
            draw(e);
        }

        function stopDrawing() {
            isDrawing = false;
            if(context != null) {
                context.beginPath();
            }
        }

        function draw(e: { clientX: number; clientY: number; }) {
            if (!isDrawing || context == null || testingContext == null) return;

            const x = e.clientX - canvas.getBoundingClientRect().left;
            const y = e.clientY - canvas.getBoundingClientRect().top;

            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.strokeStyle = 'black';
            context.lineWidth = 16;
            context.lineCap = 'round';
            context.stroke();

            lastX = x;
            lastY = y;
        }
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mousemove', draw);
    }
}
