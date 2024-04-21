
export class Drawing{
    static prepCanvas() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d');

        if(context == null) {
            return;
        }
        // Replace this with your desired Chinese character
        const originalCharacter = "明";

        // Draw the original character on the canvas in a large size
        context.font = '200px Arial';
        context.fillStyle = 'grey'; // Change the color as needed
        context.fillText(originalCharacter, 0, 170);

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
            if(context != null){
                context.beginPath();
            }
        }

        function draw(e: { clientX: any; clientY: any; }) {
            if (!isDrawing || context == null) return;

            // Get current mouse coordinates
            const x = e.clientX - canvas.getBoundingClientRect().left;
            const y = e.clientY - canvas.getBoundingClientRect().top;

            // Draw a line from the last position to the current position
            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.strokeStyle = 'black'; // Change the color as needed
            context.lineWidth = 10;
            context.lineCap = 'round';
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
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        if(context == null) return;
        // Clear the entire canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

