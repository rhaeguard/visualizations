const generateColor = (iter) => {
    var t = iter/maxIteration; // Normalized Iteration Count
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

const maxIteration = 50;

const colorMap = Array(maxIteration + 1);
colorMap.fill(null);
colorMap[maxIteration] = "black";

const cx = -0.8;
const cy = 0.156;
const r = 10;

for (let a = from; a <= to; a += step) {
    for (let b = from; b <= to; b += step) {
        let real = a;
        let imag = b;

        let iter = 0;
        while (real * real + imag * imag < r && iter < maxIteration) {
            const x = real * real - imag * imag + cx;
            const y = 2 * real * imag + cy;

            real = x;
            imag = y;

            iter++;
        }

        const coords = [a + mid, mid - b].map((c) => (c * WIDTH) / gap);
        const [x, y] = coords;

        ctx.fillRect(x, y, 5, 5);
        if (colorMap[iter] == null) {
            colorMap[iter] = generateColor();
        }
        ctx.fillStyle = colorMap[iter];
    }
}

