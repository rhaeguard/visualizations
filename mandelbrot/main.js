// Reference: https://en.wikipedia.org/wiki/Mandelbrot_set
const magnitude = (a, b) => Math.sqrt(a * a + b * b);

// Normalized Iteration Count algorithm inspired from https://solarianprogrammer.com/2013/02/28/mandelbrot-set-cpp-11/
const generateColor = (iter) => {
    var t = iter/maxIteration; 
    var r = 2.5*t**rlp*(1-t)**rrp;
    var g = 2.5*t**glp*(1-t)**grp;
    var b = 2.5*t**blp*(1-t)**brp; 
    // factor of 2 caps off parametric functions at 1, 
    // but 2.5 potential overflow is not a big deal as rgb values higher than 255 are capped
    r = Math.floor(r*255); g = Math.floor(g*255); b = Math.floor(b*255);
    return `rgb(${r},${g},${b})`
};

// cmap parametric functions zeros multiplicities, randomized between 0.5 and 2
const rlp = Math.random()*1.5+0.5; const rrp = Math.random()*1.5+0.5;
const glp = Math.random()*1.5+0.5; const grp = Math.random()*1.5+0.5;
const blp = Math.random()*1.5+0.5; const brp = Math.random()*1.5+0.5;

const WIDTH = 1000;

const canvas = document.getElementById("canvas");
canvas.width = WIDTH;
canvas.height = WIDTH;

const ctx = canvas.getContext("2d");

const from = -2;
const to = 2;
const step = 0.001;
const gap = to - from;
const mid = Math.floor(gap / 2);

const maxIteration = 1000;

const colorMap = Array(maxIteration + 1);
colorMap.fill(null);
colorMap[maxIteration] = "black";

for (let a = from; a <= to; a += step) {
    for (let b = from; b <= to; b += step) {
        let real = a;
        let imag = b;

        let iter = 0;
        while (iter < maxIteration) {
            const x = real * real - imag * imag + a;
            const y = 2 * real * imag + b;

            real = x;
            imag = y;

            if (magnitude(real, imag) >= 2) {
                break;
            }

            iter++;
        }

        const coords = [a + mid, mid - b].map((c) => (c * WIDTH) / gap);
        const [x, y] = coords;

        ctx.fillRect(x, y, 5, 5);
        if (colorMap[iter] == null) {
            colorMap[iter] = generateColor(iter);
        }
        ctx.fillStyle = colorMap[iter];
    }
}

