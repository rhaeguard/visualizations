/* Canvas parameters and setup */
const WIDTH = 1000;
const HEIGHT = 400;

const canvas = document.getElementById("canvas");
canvas.height = HEIGHT;
canvas.width = WIDTH;

/* get the context */
const ctx = canvas.getContext("2d");

/* array we want to sort */
const arr = [4, 2, 15, 9, 1, 3, 12, 8, 5, 7, 4, 2];
/* max element of the array so that we can normalize the values for drawing */
const maxElement = Math.max(...arr);

/* values for the visualization */
const len = arr.length;
const gap = 40;
const columnWidth = (WIDTH - 50) / len - gap;
const columnMaxHeight = HEIGHT - 100;

/* draw a single column */
function drawColElement(value, pos, number) {
    const x = (pos + 1) * gap + pos * columnWidth;
    const y = HEIGHT - value;

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, columnWidth, value);

    ctx.font = '20px serif';
    ctx.textAlign = 'center'
    ctx.fillText(number, x + 15, y - 20, columnWidth);
}

function drawWholeArray(array) {
    for (let i = 0; i < array.length; i++) {
        const value = (array[i] / maxElement) * columnMaxHeight;
        drawColElement(value, i, array[i]);
    }
}

/* the bubble sort algorithm that returns every variation of the array till the last sorted one */
function bubbleSort(arr) {
    const phases = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < i; j++) {
            if (arr[i] < arr[j]) {
                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                phases.push([...arr]);
            }
        }
    }
    return phases;
}
// sort the array
const phases = bubbleSort([...arr]);
/* draw original array */
drawWholeArray(arr)
document.getElementById("array").innerText = `Original array: ${arr.toString()}`
/* draw the phases */
setInterval(() => {
    if (phases.length > 0) {
        // "clear" everything
        ctx.clearRect(0, 0, WIDTH, HEIGHT)
        // draw the background "black"
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        drawWholeArray(phases.shift()) // arr.shift() pops the first element in the array, and returns it
    }
}, 200);
