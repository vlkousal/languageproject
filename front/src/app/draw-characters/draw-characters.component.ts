import {Component, EventEmitter, Output} from '@angular/core';
import {GameComponent} from "../game-component/game.component";
import {Mode} from "../constants";
import {SpeechUtils} from "../speechutils";

@Component({
  selector: 'app-draw-characters',
  templateUrl: './draw-characters.component.html',
  styleUrls: ['./draw-characters.component.css']
})
export class DrawCharactersComponent extends GameComponent {

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    correctMinimum: number = 0;

    constructor() {
        super(Mode.DrawCharacters);
    }

    resetCanvas(): void {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        const testingCanvas = document.getElementById("testingCanvas") as HTMLCanvasElement;
        const testingContext = testingCanvas.getContext('2d');
        if(context == null || testingContext == null) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        testingContext.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "#F9F8EB";
        context.fillRect(0, 0, canvas.width, canvas.height);

        testingContext.fillStyle = "#F9F8EB";
        testingContext.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "grey"
        context.fillText(this.words[this.index].question, 0, 170);

        testingContext.fillStyle = "black";
        testingContext.fillText(this.words[this.index].question, 0, 170);

        this.correctMinimum = 40000 - ((40000 - this.getBlackPixelCount()) / 2) - 2000;
    }

    getBlackPixelCount(): number {
        const testingCanvas = document.getElementById("testingCanvas") as HTMLCanvasElement;
        const testingContext = testingCanvas.getContext('2d');
        if(testingContext == null) return -1;
        const width: number = testingCanvas.width;
        const height: number = testingCanvas.height;
        const imageData = testingContext.getImageData(0, 0, 200, 200).data;

        let counter: number = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = imageData[index];
                const g = imageData[index + 1];
                const b = imageData[index + 2];
                const a = imageData[index + 3];

                if(this.rgbToHex(r, g, b, a) == "#f9f8ebfe01") counter++;
            }
        }
        return counter;
    }

    checkDrawing(): void {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const testingCanvas = document.getElementById("testingCanvas") as HTMLCanvasElement;
        const canvasContext = canvas.getContext('2d');
        const testingCanvasContext = testingCanvas.getContext('2d');
        if(canvasContext == null) return;
        if(testingCanvasContext != null) {
            testingCanvasContext.fillText(this.words[this.index].question, 0, 170);
        }
        const isCorrect: boolean = this.getCorrectPixelCount() > this.correctMinimum;

        canvasContext.fillStyle = "#59bd59";
        this.sendResult(isCorrect);
        if(!isCorrect){
            this.evalWrong();
            canvasContext.fillStyle = "#fd7676";
        } else{
            this.evalCorrect();
        }
        canvasContext.fillText(this.words[this.index].question, 0, 170);
        setTimeout(() => {
            this.setNewWord();
            this.resetCanvas();
        }, 2000);
    }

    getCorrectPixelCount(): number {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        const testingCanvas = document.getElementById("testingCanvas") as HTMLCanvasElement;
        const testingContext = testingCanvas.getContext('2d');

        if(context == null || testingContext == null) return -1;
        const width = canvas.width;
        const height = canvas.height;

        const imageData = context.getImageData(0, 0, 200, 200).data;
        const testingImageData = testingContext.getImageData(0, 0, 200, 200).data;
        let correctPixels: number = 0;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = imageData[index];
                const g = imageData[index + 1];
                const b = imageData[index + 2];
                const a = imageData[index + 3] / 255;

                const tR = testingImageData[index];
                const tG = testingImageData[index + 1];
                const tB = testingImageData[index + 2];
                const tA = testingImageData[index + 3] / 255;
                if(this.rgbToHex(r, g, b, a) == this.rgbToHex(tR, tG, tB, tA)) correctPixels++;
            }
        }
        return correctPixels;
    }

    rgbToHex(r: number, g: number, b: number, a: number = 1): string {
        const red = r.toString(16).padStart(2, "0");
        const green = g.toString(16).padStart(2, "0");
        const blue = b.toString(16).padStart(2, "0");
        const alpha = Math.round(a * 255).toString(16).padStart(2, '0');
        return `#${red}${green}${blue}${alpha}`;
    }

protected readonly SpeechUtils = SpeechUtils;
}
