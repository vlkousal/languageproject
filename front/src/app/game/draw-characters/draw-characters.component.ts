import {Component, EventEmitter, HostListener, Output} from '@angular/core';
import {GameComponent} from "../game-component/game.component";
import {BACKEND, Mode} from "../../constants";
import {Word} from "../../../Word";
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

    HINT_COLOR: string = "#cbcbc8";
    PEN_COLOR: string = "#000000";
    NO_HINT_PASSRATE: number = 0;
    HALF_HINT_PASSRATE: number = 30;
    BACKGROUND_COLOR: string = "#F9F8EB";

    CORRECT_HIGHLIGHT_COLOR: string = "#59bd59";
    WRONG_HIGHLIGHT_COLOR: string = "#f65858";

    currentPassrate: number = this.NO_HINT_PASSRATE;

    constructor(cookieService: CookieService) {
        super(Mode.DrawCharacters, cookieService);
    }

    @HostListener("document:keydown", ["$event"])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'c' || event.key === 'C') {
            this.resetCanvas();
        }

        if (event.key === 'Enter') {
            this.checkDrawing();
        }
    }

    resetCanvas(): void {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");

        if(context == null) return;

        this.currentPassrate = this.NO_HINT_PASSRATE;
        this.clearCanvas();

        context.fillStyle = this.BACKGROUND_COLOR;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const characterScore: number = this.words[this.index].getModeScore(Mode.DrawCharacters);
        if (characterScore < 70) {
            this.currentPassrate = this.HALF_HINT_PASSRATE;
            context.fillStyle = this.HINT_COLOR;
            context.fillText(this.words[this.index].question, 0, 170);

            // one half of the hint is erased
            if(characterScore >= 50) {
                const options: Coordinates[] = [
                    {"startX": 0, "startY": 0, "endX": canvas.width, "endY": 0},
                    {"startX": 0, "startY": canvas.height / 2, "endX": canvas.width, "endY": canvas.height},
                    {"startX": 0, "startY": 0, "endX": canvas.width / 2, "endY": canvas.height},
                    {"startX": canvas.width / 2, "startY": 0, "endX": canvas.width, "endY": canvas.height},
                ];
                const choice: number = Utils.getRandomInteger(0, 3);
                const randomOption: Coordinates = options[choice];
                context.clearRect(randomOption.startX, randomOption.startY, randomOption.endX, randomOption.endY);
            }
        }
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
        this.resetCanvas();
    }

    async getDrawingResult(img: string): Promise<boolean> {
        try {
            const response = await fetch(BACKEND + "api/checkimage/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    image: img,
                    correct: this.words[this.index].question,
                })
            });

            if(response.ok) {
                return JSON.parse(await response.text()).result;
            } else{
                throw new Error("XD ROFL LMAO");
            }
        }  catch(error) {
            console.error("Error:", error);
            return false;
        }
    }

    async checkDrawing(): Promise<void> {
        if(!this.allowAnswering) return;
        this.allowAnswering = false;

        this.removeAllGrayPixels();

        const currentWord: Word = this.words[this.index];
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        if(context == null) return;

        const cnvs = document.getElementById('canvas') as HTMLCanvasElement;
        const img    = cnvs.toDataURL('image/jpg');
        const isCorrect: boolean = await this.getDrawingResult(img);

        // clears the canvas, draws the character correctly
        this.clearCanvas();
        context.fillStyle = this.CORRECT_HIGHLIGHT_COLOR;
        this.sendResult(isCorrect);
        if(!isCorrect){
            this.evalWrong();
            context.fillStyle = this.WRONG_HIGHLIGHT_COLOR;
        } else{
            this.evalCorrect();
        }

        context.fillText(currentWord.question, 0, 170);
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
        }, 2500);
    }

    removeAllGrayPixels(): void {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        if (context == null) return;

        const width: number = canvas.width;
        const height: number = canvas.height;

        // Get ImageData object, not just the pixel data array
        const canvasData = context.getImageData(0, 0, width, height);
        const data = canvasData.data; // This is the pixel data array

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];

                const pixelColor: string = this.rgbToHex(r, g, b);

                // Check if this pixel color matches the hint color
                if (pixelColor != this.PEN_COLOR) {
                    const backgroundColor = this.hexToRgb(this.BACKGROUND_COLOR);
                    data[index] = backgroundColor.r;
                    data[index + 1] = backgroundColor.g;
                    data[index + 2] = backgroundColor.b;
                }
            }
        }
        context.putImageData(canvasData, 0, 0);
    }

    clearCanvas(): void {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        if (context == null) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    rgbToHex(r: number, g: number, b: number): string {
        const red = r.toString(16).padStart(2, "0");
        const green = g.toString(16).padStart(2, "0");
        const blue = b.toString(16).padStart(2, "0");
        return `#${red}${green}${blue}`;
    }

    hexToRgb(hex: string): { r: number; g: number; b: number } {
        hex = hex.replace(/^#/, "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return {r, g, b};
    }

    protected readonly localStorage = localStorage;
    protected readonly Mode = Mode;
}
