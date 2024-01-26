// Reference: https://en.wikipedia.org/wiki/Rule_110
class Rule110 {
    static intervalHandles = []
    
    constructor(canvasWidth, canvasHeight, gridStep, predefinedPatterns) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.gridStep = gridStep;

        this.generationSize = Math.floor(this.canvasWidth / this.gridStep);
        this.queue = Array(this.generationSize);

        this.predefinedPatterns = predefinedPatterns;

        let canvas = document.getElementById("grid");
        // this is how you resize the canvas
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        this.ctx = canvas.getContext("2d");
        
        this.drawSpeed = 100;
    }

    // Reference: https://codereview.stackexchange.com/a/135207
    drawGrid() {
        const w = this.canvasWidth;
        const h = this.canvasHeight;
        const step = this.gridStep;

        // draw vertical lines
        this.ctx.beginPath();
        for (let x = 0; x <= w; x += step) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, h);
        }
        this.ctx.strokeStyle = "grey";
        this.ctx.stroke();

        // draw horizontal lines
        this.ctx.beginPath();
        for (let y = 0; y <= h; y += step) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(w, y);
        }
        this.ctx.strokeStyle = "grey";
        this.ctx.stroke();
    }

    display(row, arr) {
        console.log(row, arr)
        for (let i = 0; i < arr.length; i++) {
            if (i >= 0 && i <= arr.length - 1) {
                if (arr[i] === 1) {
                    this.ctx.fillRect(
                        i * this.gridStep,
                        row * this.gridStep,
                        this.gridStep,
                        this.gridStep
                    );
                    this.ctx.fillColor = "black";
                }
            }
        }
    }

    calculate() {
        // Reference: https://en.wikipedia.org/wiki/Rule_110

        const size = this.generationSize;
        // initialize the current generation
        let curr = Array(size).fill(0);
        // curr[0] = 1;
        // curr[size - 1] = 1;
        curr[Math.floor(size / 2)] = 1
        // allocate space for the next generation
        let next = Array(size).fill(0);

        // loop size number of times to generate multiple generations
        for (let i = 0; i < size; i++) {
            // push the current generation to the queue of results
            this.queue[size - i - 1] = [i, [...curr]];
            
            // scan the current generation to generate the next one
            for (let j = 1; j < size-1; j++) {
                // we scan three bits at a time, a, b and c represent those bits
                // ((i % max) + max) % max
                const a = curr[j-1];
                const b = curr[j];
                const c = curr[j+1];
                // we treat a, b, c in general as one decimal number but in binary format.
                // thus we need to convert it back to the decimal format so that we can decide which
                // pattern will be next 
                const ix = (a << 2) | (b << 1) | c;
                let mask = 1 << ix;
                next[j] = (this.predefinedPatterns & mask) === 0 ? 0 : 1;
            }
            // swap between curr and next
            const temp = curr;
            curr = next;
            next = temp;
        }
    }

    draw() {
        // clear any remaining intervals from the previous run
        Rule110.intervalHandles.forEach(handle => clearInterval(handle))

        const handle = setInterval(
            (obj) => {
                const [self] = obj;
                if (self.queue.length > 0) {
                    const [row, arr] = self.queue.pop();
                    self.display(row, arr);
                }
            },
            this.drawSpeed,
            [this]
        );

        Rule110.intervalHandles.push(handle)
    }
}

function getValueOf (id, defaultValue) {
    const element = document.getElementById(id)
    const v = element.value
    if (v && v.trim() !== "") {
        return v
    }
    element.value = defaultValue
    return defaultValue
}

document.getElementById("drawBtn").addEventListener("click", (e) => {
    const w = parseInt(getValueOf("width", 500));
    const g = parseInt(getValueOf("generation", 25));
    const p = parseInt(getValueOf("rule", 110));

    const r = new Rule110(w, w, Math.floor(w / g), p);
    r.drawGrid();
    r.calculate();
    r.draw();
});