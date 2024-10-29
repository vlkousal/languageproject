import {Component, EventEmitter, Output} from '@angular/core';
import {GameComponent} from "../game-component/game.component";
import {Mode} from "../../constants";
import {SpeechUtils} from "../../speechutils";
import {Word} from "../../../word";
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'app-draw-characters',
  templateUrl: './draw-characters.component.html',
  styleUrls: ['./draw-characters.component.css']
})
export class DrawCharactersComponent extends GameComponent {

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    allowAnswering: boolean = true;

    BACKGROUND_COLOR: string = "#F9F8EB";
    HINT_COLOR: string = "#818589";
    PEN_COLOR: string = "#000000";

    ACCEPTABLE_PERCENTAGE: number = 82.5;

    constructor(cookieService: CookieService) {
        super(Mode.DrawCharacters, cookieService);
    }

    resetCanvas(): void {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        const testingCanvas = document.getElementById("testingCanvas") as HTMLCanvasElement;
        const testingContext = testingCanvas.getContext('2d');
        if(context == null || testingContext == null) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        testingContext.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = this.BACKGROUND_COLOR;
        context.fillRect(0, 0, canvas.width, canvas.height);

        testingContext.fillStyle = this.BACKGROUND_COLOR;
        testingContext.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = this.HINT_COLOR;
        context.fillText(this.words[this.index].question, 0, 170);

        testingContext.fillStyle = this.PEN_COLOR;
        testingContext.fillText(this.words[this.index].question, 0, 170);
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

                if(canvasColor == testCanvasColor) {
                    counter++;
                }

                if(testCanvasColor == this.PEN_COLOR && canvasColor != this.PEN_COLOR) {
                    counter--;
                }
            }
        }
        const percentage: number = (counter / (200 * 200)) * 100;
        console.log(counter + " / " + (200 * 200) + " - " + percentage + "%");

        const isCorrect: boolean = percentage >= this.ACCEPTABLE_PERCENTAGE;

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
