import {Component, EventEmitter, Output} from '@angular/core';
import {GameComponent} from "../game-component/game.component";
import {Mode} from "../../constants";
import {SpeechUtils} from "../../speechutils";
import {Word} from "../../../word";
import {CookieService} from "ngx-cookie";
import {Utils} from "../../utils";

interface Coordinates {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}


@Component({
  selector: 'app-draw-characters',
  templateUrl: './draw-characters.component.html',
  styleUrls: ['./draw-characters.component.css']
})
export class DrawCharactersComponent extends GameComponent {

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    allowAnswering: boolean = true;

    BACKGROUND_COLOR: string = "#F9F8EB";
    HINT_COLOR: string = "#cbcbc8";
    PEN_COLOR: string = "#000000";

    NO_HINT_PASSRATE: number = 0;
    HALF_HINT_PASSRATE: number = 30;
    HINT_PASSRATE: number = 50;

    currentPassrate: number = this.NO_HINT_PASSRATE;

    constructor(cookieService: CookieService) {
        super(Mode.DrawCharacters, cookieService);
    }

    resetCanvas(): void {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        const testingCanvas = document.getElementById("testingCanvas") as HTMLCanvasElement;
        const testingContext = testingCanvas.getContext('2d');
        if(context == null || testingContext == null) return;

        this.currentPassrate = this.NO_HINT_PASSRATE;

        // clears the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        testingContext.clearRect(0, 0, canvas.width, canvas.height);

        // sets the background color
        context.fillStyle = this.BACKGROUND_COLOR;
        context.fillRect(0, 0, canvas.width, canvas.height);

        testingContext.fillStyle = this.BACKGROUND_COLOR;
        testingContext.fillRect(0, 0, canvas.width, canvas.height);

        // fills the canvas for checking the answer
        testingContext.fillStyle = this.PEN_COLOR;
        testingContext.fillText(this.words[this.index].question, 0, 170);

        const characterScore: number = this.words[this.index].getModeScore(Mode.DrawCharacters);
        if (characterScore < 75) {
            this.currentPassrate = this.HALF_HINT_PASSRATE;
            context.fillStyle = this.HINT_COLOR;
            context.fillText(this.words[this.index].question, 0, 170);

            // one half of the hint is erased
            if(characterScore >= 50) {
                const options: Coordinates[] = [
                    {"startX": 0, "startY": 0, "endX": 200, "endY": 0},
                    {"startX": 0, "startY": 100, "endX": 200, "endY": 200},
                    {"startX": 0, "startY": 0, "endX": 100, "endY": 200},
                    {"startX": 100, "startY": 0, "endX": 200, "endY": 200},
                ];
                const choice: number = Utils.getRandomInteger(0, 3);
                const randomOption: Coordinates = options[choice];
                context.clearRect(randomOption.startX, randomOption.startY, randomOption.endX, randomOption.endY);
                console.log("Choice: ", choice);
            }
        }
        console.log("Current passrate:", this.currentPassrate + " %");

    }

    override replayAll(): void {
        GameComponent.prepDrawingCanvas();
        this.words = [...this.wordsCopy];
        this.resetStats();
    }

    override replayWrong() : void {
        this.words = [...this.wrong];
        this.resetStats();
        this.resetCanvas();
        this.repeatingWrong = true;
    }

    override setNewWord(): void {
        const currentWord: Word = this.words[this.index];
        this.resetCanvas();
        SpeechUtils.speak(currentWord.question, false);
    }

    checkDrawing(): void {
        if(!this.allowAnswering) return;
        this.allowAnswering = false;
        const currentWord: Word = this.words[this.index];
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const testingCanvas = document.getElementById("testingCanvas") as HTMLCanvasElement;
        const canvasContext = canvas.getContext('2d');
        const testingCanvasContext = testingCanvas.getContext('2d');
        if(canvasContext == null || testingCanvasContext == null) return;

        testingCanvasContext.fillText(currentWord.question, 0, 170);

        const width: number = testingCanvas.width;
        const height: number = testingCanvas.height;
        const canvasData = canvasContext.getImageData(0, 0, width, height).data;
        const testData = testingCanvasContext.getImageData(0, 0, width, height).data;
        let counter: number = 0;

        const blackPixelCount: number = this.getBlackPixelCount();
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;

                const r1 = canvasData[index];
                const r2 = testData[index];

                const g1 = canvasData[index];
                const g2 = testData[index];

                const b1 = canvasData[index];
                const b2 = testData[index];

                const canvasColor: string = this.rgbToHex(r1, g1, b1);
                const testCanvasColor: string = this.rgbToHex(r2, g2, b2);

                // checks whether the whole canvas isn't filled
                if(canvasColor == this.PEN_COLOR || testCanvasColor == this.PEN_COLOR) {
                    testCanvasColor == canvasColor ? counter++ : counter--;
                }
            }
        }
        console.log("Black pixel count: " + this.getBlackPixelCount());
        const percentage: number = (counter / blackPixelCount) * 100;
        console.log(counter + " / " + blackPixelCount + " - " + percentage + "%");

        const isCorrect: boolean = percentage >= this.currentPassrate;

        canvasContext.fillStyle = "#59bd59";
        this.sendResult(isCorrect);
        if(!isCorrect){
            this.evalWrong();
            canvasContext.fillStyle = "#fd7676";
        } else{
            this.evalCorrect();
        }
        SpeechUtils.speak(currentWord.correct, true);

        canvasContext.fillText(currentWord.question, 0, 170);
        setTimeout(() => {
            this.index++;
            this.setNewWord();
            this.resetCanvas();
            this.allowAnswering = true;

            if(this.lives == 0 || this.index == this.words.length - 1) {
                this.showEnd = true;
                if(!this.repeatingWrong) {
                    this.sendVocabSetResult();
                }
                return;
            }
        }, 1500);
    }

    getBlackPixelCount(): number {
        const testingCanvas = document.getElementById("testingCanvas") as HTMLCanvasElement;
        const testingCanvasContext = testingCanvas.getContext('2d');
        if(testingCanvasContext == null) return 0;

        const width: number = testingCanvas.width;
        const height: number = testingCanvas.height;
        const testData = testingCanvasContext.getImageData(0, 0, width, height).data;
        let counter: number = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = testData[index];
                const g = testData[index];
                const b = testData[index];

                const testCanvasColor: string = this.rgbToHex(r, g, b);

                // checks whether the whole canvas isn't filled
                if(testCanvasColor == this.PEN_COLOR) {
                    counter++
                }
            }
        }
        return counter;
    }

    rgbToHex(r: number, g: number, b: number): string {
        const red = r.toString(16).padStart(2, "0");
        const green = g.toString(16).padStart(2, "0");
        const blue = b.toString(16).padStart(2, "0");
        return `#${red}${green}${blue}`;
    }

protected readonly SpeechUtils = SpeechUtils;
    protected readonly localStorage = localStorage;
    protected readonly Mode = Mode;
}
