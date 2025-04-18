import {Component, Injectable, Input, OnInit} from '@angular/core';
import {BACKEND, MAX_HEALTH, Mode, STREAK_FOR_HEALTH} from "../../constants";
import {Utils} from "../../utils";
import {ApiTools} from "../../api-tools";
import {Word} from "../../../Word";
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'app-game-component',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
@Injectable({
    providedIn: "root"
})
export class GameComponent implements OnInit {

    showEnd: boolean = false;
    @Input() words: Word[] = [];
    @Input() id: number = -1;
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

    protected cookieService: CookieService;

    constructor(mode: Mode, cookieService: CookieService) {
        this.mode = mode;
        this.cookieService = cookieService;
    }

    async ngOnInit(): Promise<void> {
        this.weightedWordShuffle();
        Word.sortByScore(this.words, this.mode);
        this.wordsCopy = [...this.words];
        this.highScore = await ApiTools.getHighScore(this.id, this.mode, this.cookieService);
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
        this.weightedWordShuffle();
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

    weightedWordShuffle(): void {
        const priorities: number[] = [];
        this.words.forEach(item => {
            priorities.push(Math.random() * (100 - item.getModeScore(this.mode)));
        });
        this.words.sort((a, b) => priorities[this.words.indexOf(a)] - priorities[this.words.indexOf(b)]);
    }

    sendResult(correct: boolean): void {
        const data = {
            token: this.cookieService.get("token"),
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
        const currentWord: Word = this.words[this.index];

        // throw a coin to decide whether the languages get flipped
        const coinFlip: number = Utils.getRandomInteger(0, 1);
        if(coinFlip == 1) {
            this.isFlipped = true;
            this.words[this.index] = new Word(currentWord.id, currentWord.scores, currentWord.correct,
                currentWord.phonetic, currentWord.question, currentWord.flippedAnswers, currentWord.answers);
            return;
        }
        this.isFlipped = false;
    }

    sendVocabSetResult(): void {
        const data = {
            token: this.cookieService.get("token"),
            id: this.id,
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
        const context = canvas.getContext('2d');
        if(context == null) return;

        context.font = '200px Arial';

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
            if (!isDrawing || context == null) return;

            const x = e.clientX - canvas.getBoundingClientRect().left;
            const y = e.clientY - canvas.getBoundingClientRect().top;

            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.strokeStyle = ('black');
            context.globalAlpha = 100;
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
