import {Component} from '@angular/core';
import {VocabSet} from "../constants";


@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})

export class IndexComponent {
    debug: string = "";
    sets: VocabSet[] = [];

    async ngOnInit(){
        let dataString: string = JSON.parse(await this.getSets()).forEach((item: { name: string; url: string; }) => {
            this.sets.push(new VocabSet(item.name, item.url));
        });
        this.debug = await this.getSets();

        // Replace this with your desired Chinese character
        var originalCharacter = "明";

        var canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let context = canvas.getContext('2d');

        // Draw the original character on the canvas in a large size
        // @ts-ignore
        context.font = '200px Arial';
        // @ts-ignore
        context.fillStyle = 'grey'; // Change the color as needed
        // @ts-ignore
        context.fillText(originalCharacter, 0, 170);

        var isDrawing = false;
        var lastX = 0;
        var lastY = 0;

        function startDrawing(e: { clientX: number; clientY: number; }) {
            isDrawing = true;
            lastX = e.clientX - canvas.getBoundingClientRect().left;
            lastY = e.clientY - canvas.getBoundingClientRect().top;
            draw(e);
        }

        function stopDrawing() {
            isDrawing = false;
            // @ts-ignore
            context.beginPath();
        }

        function draw(e: { clientX: any; clientY: any; }) {
            if (!isDrawing) return;

            // Get current mouse coordinates
            var x = e.clientX - canvas.getBoundingClientRect().left;
            var y = e.clientY - canvas.getBoundingClientRect().top;

            // Draw a line from the last position to the current position
            // @ts-ignore
            context.beginPath();
            // @ts-ignore
            context.moveTo(lastX, lastY);
            // @ts-ignore
            context.lineTo(x, y);
            // @ts-ignore
            context.strokeStyle = 'black'; // Change the color as needed
            // @ts-ignore
            context.lineWidth = 10;
            // @ts-ignore
            context.lineCap = 'round';
            // @ts-ignore
            context.stroke();

            // Update last position
            lastX = x;
            lastY = y;
        }

        // Event listeners for mouse actions
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mousemove', draw);
    }

    resetCanvas(){
        var canvas = document.getElementById("canvas");
        // @ts-ignore
        var context = canvas.getContext("2d");

        // Clear the entire canvas
        // @ts-ignore
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    async getSets() {
        const response: Response = await fetch("http://localhost:8000/api/getvocabsets/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(response.ok){
            return await response.text();
        }
        return "failed";
    }
}
