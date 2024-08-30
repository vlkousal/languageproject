
export class Drawing {

    static prepCanvas(symbol: string) {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const testingCanvas = document.getElementById("testingCanvas") as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        const testingContext = testingCanvas.getContext('2d');
        const originalCharacter: string = symbol;

        if(context == null || testingContext == null) return;

        context.font = '200px Arial';
        testingContext.font = "200px Arial";
        context.fillStyle = "grey";
        testingContext.fillStyle = "black";
        context.fillText(originalCharacter, 0, 170);
        testingContext.fillText(originalCharacter, 0, 170);

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


