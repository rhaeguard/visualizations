// Reference: https://en.wikipedia.org/wiki/Julia_set
const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`
};

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

