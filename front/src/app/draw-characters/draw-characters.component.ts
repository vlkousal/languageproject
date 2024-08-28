import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameComponent} from "../game-component/game.component";
import {Mode, Word} from "../constants";
import {Drawing} from "../drawing";
import {SpeechUtils} from "../speechutils";

@Component({
  selector: 'app-draw-characters',
  templateUrl: './draw-characters.component.html',
  styleUrls: ['./draw-characters.component.css']
})
export class DrawCharactersComponent extends GameComponent {

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();

    constructor() {
        super(Mode.DrawCharacters);
    }

    resetCanvas(): void {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        if(context == null) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillText(this.words[this.index].question, 0, 170);
    }

    checkDrawing(): void {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const testingCanvas = document.getElementById("testingCanvas") as HTMLCanvasElement;
        if(canvas === null || testingCanvas === null) return;
        const canvasContext = canvas.getContext('2d');
        const testingCanvasContext = testingCanvas.getContext('2d');
        if(canvasContext != null && testingCanvasContext != null) {
            testingCanvasContext.fillText(this.words[this.index].question, 0, 170);
        }
        this.getCorrectPixelCount() > 34000 ? this.evalCorrect() : this.evalWrong();
        this.getCorrectPixelCount();
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
        console.log(correctPixels);
        return correctPixels;
    }

    rgbToHex(r: number, g: number, b: number, a: number): string {
        const red = r.toString(16).padStart(2, "0");
        const green = g.toString(16).padStart(2, "0");
        const blue = b.toString(16).padStart(2, "0");
        const alpha = Math.round(a * 255).toString(16).padStart(2, '0');
        return `#${red}${green}${blue}${alpha}`;
    }


protected readonly SpeechUtils = SpeechUtils;
}
