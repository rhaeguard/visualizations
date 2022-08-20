// Reference: https://en.wikipedia.org/wiki/Mandelbrot_set
const magnitude = (a, b) => Math.sqrt(a * a + b * b);

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
            colorMap[iter] = generateColor();
        }
        ctx.fillStyle = colorMap[iter];
    }
}

