const WIDTH = 1000;
const HEIGHT = 400;
const canvas = document.getElementById("canvas");
canvas.height = HEIGHT;
canvas.width = WIDTH;

const ctx = canvas.getContext("2d");

ctx.fillRect(0, 0, WIDTH, HEIGHT);

const arr = [4, 2, 15, 9, 1, 3, 12, 8, 5, 7, 4, 2];

function drawColElement(pos, array, maxElement, ctx) {
    const value = (array[pos] / maxElement) * (HEIGHT - 100);

    const n = array.length;
    const gap = 40;
    const wid = (WIDTH - 50) / n - gap;

    pos = pos + 1;
    const x = pos * gap + (pos - 1) * wid;
    const y = HEIGHT - value;

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, wid, value);
}

const max = 15;

for (let i = 0; i < arr.length; i++) {
    drawColElement(i, arr, max, ctx);
}

const phases = [];

function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (arr[i] < arr[j]) {
                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                phases.push([...arr]);
            }
        }
    }
}

bubbleSort(arr);

setInterval(() => {
    if (phases.length > 0) {
        const phase = phases.shift()
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        for (let i = 0; i < phase.length; i++) {
            drawColElement(i, phase, max, ctx);
        }
    }
}, 200);
